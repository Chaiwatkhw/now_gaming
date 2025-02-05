// server.js
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2/promise');

const manageServer = require('./manageServer');
const cartServer = require('./cartServer');

const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const secretKey = 'nowgaming';


const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
    name: 'session',
    secret: 'nowgaming',
    httpOnly: true,
    maxAge:  3600 * 1000
}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/manage', manageServer);
app.use('/cart',cartServer);

async function connectDB() {
    try {
        const connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'now_gaming',
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
        });
        return connection;
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        throw error; // ปล่อยข้อผิดพลาดให้โปรแกรมแจ้ง
    }
}

let db;
connectDB().then((connection) => {
    db = connection;
}).catch((error) => {
    console.error('Error connecting to the database: ', error);
});


const isUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
        }

        // ตรวจสอบว่า role ต้องเป็น 'admin' หรือ 'user'
        if (decoded.role !== 'admin' && decoded.role !== 'user') {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        // หาก role ถูกต้อง ดำเนินการถัดไป
        req.user = decoded; // เก็บข้อมูลผู้ใช้ใน request
        next();
    });
};

const isAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
        }

        // ตรวจสอบว่า role เป็น admin หรือไม่
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        // ถ้าเป็น admin ให้ดำเนินการถัดไป
        req.user = decoded; // เก็บข้อมูลผู้ใช้ใน request
        next();
    });
};

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getGame', async (req, res) => {
    try {
        const query = `
           SELECT 
    g.game_id,
    g.game_title,
    g.game_description,
    g.game_image,
    g.game_category,  -- ✅ เพิ่มประเภทเกม
    hp.game_price,
    COUNT(k.keygame) AS key_count
FROM 
    games g
JOIN 
    historyprice hp
    ON g.game_id = hp.game_id
LEFT JOIN 
    keygames k
    ON g.game_id = k.game_id AND k.key_used = 0  -- นับเฉพาะ Key ที่ยังไม่ใช้
WHERE 
    hp.start_date = (
        SELECT MAX(hp2.start_date)
        FROM historyprice hp2
        WHERE hp2.game_id = hp.game_id
    )
AND 
    g.game_deleted = 0
GROUP BY 
    g.game_id, g.game_title, g.game_description, g.game_image, g.game_category, hp.game_price  -- ✅ Group ด้วย game_genre ด้วย
HAVING 
    COUNT(k.keygame) > 0  -- เอาเฉพาะเกมที่มี Key ใช้ได้

        `;
        const [games] = await db.query(query);
        res.json(games);
    } catch (error) {
        console.error('Error getting games: ', error);
        res.status(500).json({ error: 'Error getting games' });
    }
});
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


app.post('/register',async (req, res) => {
    try{
        const { username,email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [checkuser] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email]);
        if(checkuser.length > 0){
            res.status(400).json({ error: 'Username or email already exists' });
            return;
        }
        db.query('INSERT INTO users (username,email,password) VALUES (?,?,?)',[username,email,hashedPassword]);
        res.status(200).json({ message: 'User registered' });
    }
    catch(error){
        console.error('Error registering user: ', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    //console.log('Received Login Request:', req.body);
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        const [user] = await db.query(query, [username, username]);
        if (!user.length) {
            return res.status(400).json({ error: 'User not Found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user[0].password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ 
            userId: user[0].id, 
            role: user[0].role,
            username: user[0].username  // เพิ่ม username ลงไปใน payload
        }, secretKey, { expiresIn: '24h' });
        
        console.log('Generated Token:', token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 วัน
        });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/checklogin', isUser, async (req, res) => {
    res.json({ 
        message: 'You are authorized', 
        user: req.user // ส่งข้อมูลผู้ใช้กลับไป
    });
});

// สร้าง transporter สำหรับส่งอีเมล
const transporter = nodemailer.createTransport({
    service: 'gmail', // ใช้ Gmail หรือบริการอื่น ๆ
    auth: {
        user: 'nowgaming2025@gmail.com', // ใส่อีเมลของคุณ
        pass: 'ifhg vlam shob jnlw'   // ใส่รหัสผ่านของคุณ
    }
});

// ฟังก์ชั่นสำหรับส่ง OTP
function sendOtpEmail(toEmail, otp) {
    const mailOptions = {
        from: 'nowgaming2025@gmail.com',
        to: toEmail,
        subject: 'Email Verification - OTP',
        html: `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: "Barlow", sans-serif;
            background-color: #f4f4f9;
            color: #000000;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            background-color: #dbdbdb;
            border-radius: 8px;
            padding: 20px;
          }
          .header {
            gap:10px;
            background-color: #272727;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
          }
          .content {
            padding: 20px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Now Gaming</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up with NowGaming. We're excited to have you on board.</p>
            <p>Your One-Time Password (OTP) is:</p>
            <p style="color: #4CAF50; font-size: 30px; text-align: center;"><strong>${otp}</strong></p>
          </div>
        </div>
      </body>
    </html>
  `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// ฟังก์ชั่นสำหรับส่ง OTP
function sendOtpResetPassword(toEmail, otp) {
    const mailOptions = {
        from: 'nowgaming2025@gmail.com',
        to: toEmail,
        subject: 'Email Verification - OTP',
        html: `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: "Barlow", sans-serif;
            background-color: #f4f4f9;
            color: #000000;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            background-color: #dbdbdb;
            border-radius: 8px;
            padding: 20px;
          }
          .header {
            gap:10px;
            background-color: #272727;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
          }
          .content {
            padding: 20px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Now Gaming</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your NowGaming account.</p>
            <p>our One-Time Password (OTP) to reset your password is:</p>
            <p style="color: #4CAF50; font-size: 30px; text-align: center;"><strong>${otp}</strong></p>
          </div>
        </div>
      </body>
    </html>
  `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);  // สร้าง OTP 6 หลัก
    return otp;
}

// ฟังก์ชั่นสำหรับเข้ารหัส OTP ด้วย bcrypt
async function encryptOtp(otp) {
    const saltRounds = 10;  // จำนวนรอบในการเข้ารหัส
    const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);  // เข้ารหัส OTP
    return hashedOtp;
}

// ฟังก์ชั่นสำหรับตรวจสอบ OTP ที่กรอก
async function checkOtp(userOtp, hashedOtp) {
    const match = await bcrypt.compare(userOtp, hashedOtp);  // เปรียบเทียบ OTP ที่กรอกกับที่เข้ารหัส
    return match;  // คืนค่า true ถ้า OTP ตรงกัน
}

app.get('/checkuser',async(req,res)=>{
    const { username, email } = req.query; 
    const [checkuser] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email]);
    if(checkuser.length > 0){
        res.status(400).json({ error: 'Username or email already exists' });
        return;
    }
    else{
        const otp = generateOtp();
        const encryptedOtp = await encryptOtp(otp);
        sendOtpEmail(email,otp);
        // เก็บ OTP ที่เข้ารหัสในคุกกี้
        res.cookie('userOtp', encryptedOtp, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 5 * 60 * 1000  // เก็บ OTP ในคุกกี้เป็นเวลา 5 นาที
        });
        res.json({message: 'Send OTP to verify email.'});
    }
});

// ฟังก์ชั่นสำหรับตรวจสอบ OTP ที่ผู้ใช้กรอก
app.post('/verifyOtp', async (req, res) => {
    const { otp } = req.body;
    const hashedOtp = req.cookies.userOtp;

    if (!hashedOtp) {
        return res.status(400).json({ error: 'OTP has expired or not found' });
    }

    const isOtpValid = await checkOtp(otp, hashedOtp);
    if (isOtpValid) {
        res.status(200).json({ message: 'OTP is valid' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

app.get('/forgotPassword', async (req,res)=>{
    const { email } = req.query; 
    console.log(email);
    const [checkuser] = await db.query('SELECT * FROM users WHERE email = ?',[email]);
    if(checkuser.length == 0){
        res.status(400).json({ error: 'User not found in the system' });
        return;
    }
    else{
        const otp = generateOtp();
        const encryptedOtp = await encryptOtp(otp);
        sendOtpResetPassword(email,otp);
        // เก็บ OTP ที่เข้ารหัสในคุกกี้
        res.cookie('userOtp', encryptedOtp, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 5 * 60 * 1000  // เก็บ OTP ในคุกกี้เป็นเวลา 5 นาที
        });
        res.json({message: 'Send OTP to reset password'});
    }
});

app.patch('/updatePassword',async (req,res)=>{
    const {email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(`UPDATE users SET password = ? WHERE email=?`,[hashedPassword,email]);
    res.json({message: "Your Password is Update"});
});

app.post('/logout', (req, res) => {
    // ลบ cookie 'token'
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    // ส่ง response กลับไปยัง client
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/gameModal', async (req, res) => {
    try {
        const { game_id } = req.query;
        const db = await connectDB();
        const [gameData] = await db.query(`
            SELECT 
                g.game_id, 
                g.game_title, 
                g.game_image, 
                g.game_description,
                g.game_category,
                hp.game_price, 
                COUNT(k.keygame) AS key_count
            FROM 
                games g
            LEFT JOIN 
                keygames k ON g.game_id = k.game_id AND k.key_used = 0
            LEFT JOIN 
                historyprice hp ON g.game_id = hp.game_id
            WHERE 
                g.game_id = ?
                AND g.game_deleted = 0
                AND hp.start_date = (
                    SELECT MAX(start_date)
                    FROM historyprice 
                    WHERE game_id = g.game_id
                )
            GROUP BY 
                g.game_id, g.game_title, g.game_image, g.game_description, hp.game_price
        `, [game_id]);

        res.send(gameData);
    } catch (err) {
        res.status(404).send('Game not Found');
    }
});

app.get('/checkAdmin',isAdmin,(req,res)=>{
    res.json({ 
        success: true,
        message: 'User is an admin', 
        user: req.user // ส่งข้อมูลผู้ใช้กลับไป
    });
});

app.post('/addcart', async (req, res) => {
    const { game_id } = req.body;
    const token = req.cookies.token; // อ่าน JWT จาก Cookie

    if (!token) return res.status(401).json({ error: "No token found" });

    try {
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        const db = await connectDB();
        
        // ดึง user_id จาก username
        const [userResult] = await db.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // ตรวจสอบว่ามี game_id ใน cart ของ user นี้หรือยัง
        const [cartResult] = await db.query(`SELECT quantity FROM cart WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);

        if (cartResult.length === 0) {
            // ถ้ายังไม่มี → INSERT
            await db.query(`INSERT INTO cart (user_id, game_id, quantity) VALUES (?, ?, 1)`, [user_id, game_id]);
        } else {
            // ถ้ามีแล้ว → UPDATE quantity +1
            //await db.query(`UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
        }

        res.json({ message: "Add Cart Success." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Add Cart Failed." });
    }
});


app.post('/amountCart', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "No token found" });

        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        const db = await connectDB();
        
        // ค้นหา user_id
        const [userResult] = await db.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // นับจำนวนรายการสินค้า (ไม่นับ quantity)
        const [cartResult] = await db.query(`SELECT COUNT(DISTINCT game_id) AS total FROM cart WHERE user_id = ?`, [user_id]);
        const count = cartResult[0].total || 0;

        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

