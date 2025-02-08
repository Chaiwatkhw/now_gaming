const express = require('express');
const router = express.Router(); 
const mysql = require('mysql2/promise');
const cors = require('cors');  
const path = require('path');
const cookieParser = require('cookie-parser');
router.use(cors());
router.use(cookieParser());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
router.use(express.json());
const secretKey = 'nowgaming';
require('dotenv').config();
const saltRounds = 10; 

async function connectDB() {
    const connection = await mysql.createPool({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        queueLimit: 0,
    });
    return connection;
}

router.get('/', async (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

router.get('/getUserData', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, error: "No token found" });

        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        const db = await connectDB();

        // ดึงข้อมูล username และ email
        const [userResult] = await db.query(
            `SELECT username, email FROM users WHERE username = ?`, 
            [username]
        );

        if (userResult.length === 0) return res.status(404).json({ success: false, error: "User not found" });

        res.json({ success: true, username: userResult[0].username, email: userResult[0].email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

router.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        const db = await connectDB();
        // ค้นหารหัสผ่านเดิมของผู้ใช้จากฐานข้อมูล
        const [rows] = await db.query('SELECT password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้นี้' });
        }

        const hashedPassword = rows[0].password;

        // ตรวจสอบว่ารหัสผ่านปัจจุบันถูกต้องหรือไม่
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
        }

        // แฮชรหัสผ่านใหม่
        const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // อัปเดตรหัสผ่านในฐานข้อมูล
        await db.query('UPDATE users SET password = ? WHERE email = ?', [newHashedPassword, email]);

        res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});

// Route to get the order details for the logged-in user
router.get('/getorder', async (req, res) => {
    const token = req.cookies.token; // อ่าน JWT จาก Cookie

    if (!token) return res.status(401).json({ error: "No token found" });

    try {
        const decoded = jwt.verify(token, secretKey); // ตรวจสอบ JWT
        const username = decoded.username;

        const db = await connectDB(); // สร้างการเชื่อมต่อฐานข้อมูล

        // ดึง user_id จาก username
        const [userResult] = await db.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // ดึงข้อมูลการสั่งซื้อของ user_id
        const [orderResults] = await db.query(`
            SELECT 
                o.order_id, 
                g.game_title, 
                od.keygame, 
                hp.game_price
            FROM 
                orders o
            JOIN 
                orderdetail od ON o.order_id = od.order_id
            JOIN 
                games g ON od.game_id = g.game_id
            JOIN 
                keygames k ON od.keygame = k.keygame
            JOIN 
                historyprice hp ON od.price_id = hp.history_id
            WHERE 
                o.user_id = ?
            ORDER BY
                o.order_id DESC 
                `
                , [user_id]);

        if (orderResults.length === 0) return res.status(404).json({ error: "No orders found" });

        // ส่งข้อมูลคำสั่งซื้อกลับไปที่ฝั่งลูกค้า
        res.json({ orders: orderResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;