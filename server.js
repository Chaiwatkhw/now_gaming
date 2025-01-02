// server.js
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2/promise');
const manageServer = require('./manageServer');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
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

async function connectDB() {
    try {
        const connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'now_gaming',
            waitForConnections: true,
            connectionLimit: 10,
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
                hp.game_price
            FROM 
                games g
            JOIN 
                historyprice hp
            ON 
                g.game_id = hp.game_id
            WHERE 
                hp.start_date = (
                    SELECT MAX(hp2.start_date)
                    FROM historyprice hp2
                    WHERE hp2.game_id = hp.game_id
                )
            AND 
                g.game_deleted = 0
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
    console.log('Received Login Request:', req.body);
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        const [user] = await db.query(query, [username, username]);
        if (!user.length) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user[0].password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ 
            userId: user[0].id, 
            role: user[0].role,
            username: user[0].username  // เพิ่ม username ลงไปใน payload
        }, secretKey, { expiresIn: '30m' });
        
        console.log('Generated Token:', token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function checkAuth(req, res, next){
    const token = req.cookies.token;
    console.log('Received Token:', token);
    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try{
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({ error:'Invalid or expired token' });
    }
}

app.get('/checklogin', checkAuth, async (req, res) => {
    res.json({ message: 'You are authorized' ,user: req.user});
});

