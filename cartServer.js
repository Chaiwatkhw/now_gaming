const express = require('express');
const router = express.Router(); 
const mysql = require('mysql2/promise');
const cors = require('cors');  
const path = require('path');
const cookieParser = require('cookie-parser');
router.use(cors());
router.use(cookieParser());
const jwt = require('jsonwebtoken');

const secretKey = 'nowgaming';

async function connectDB() {
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
}

router.get('/', async (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

router.post('/getCart', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "No token found" });

        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        const db = await connectDB();

        // ดึง user_id
        const [userResult] = await db.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // ดึงข้อมูลตะกร้า พร้อมราคาล่าสุด
        const [cartItems] = await db.query(
            `SELECT 
                cart.game_id,
                games.game_title,
                games.game_image,
                COALESCE(
                    (SELECT game_price FROM historyprice 
                     WHERE historyprice.game_id = cart.game_id 
                     ORDER BY start_date DESC LIMIT 1), 
                    0
                ) AS game_price, 
                cart.quantity
            FROM cart
            JOIN games ON cart.game_id = games.game_id
            WHERE cart.user_id = ?;`,
            [user_id]
        );

        res.json({ cart: cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});



module.exports = router;