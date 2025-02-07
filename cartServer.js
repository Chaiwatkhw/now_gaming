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
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
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

        // ดึงข้อมูลตะกร้า พร้อมราคาล่าสุด และจำนวนคีย์ที่ยังไม่ได้ใช้
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
                cart.quantity,
                COALESCE(
                    (SELECT COUNT(*) FROM keygames 
                     WHERE keygames.game_id = cart.game_id 
                     AND keygames.key_used = 0), 
                    0
                ) AS available_keys
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


router.post('/removeCart', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "No token found" });

        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;
        const { game_id } = req.body;

        if (!game_id) return res.status(400).json({ error: "Game ID is required" });

        const db = await connectDB();

        // ดึง user_id
        const [userResult] = await db.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // ลบเกมออกจากตะกร้าของผู้ใช้
        const [deleteResult] = await db.query(`DELETE FROM cart WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);

        if (deleteResult.affectedRows > 0) {
            res.status(200).json({ message: "Game removed from cart successfully" });
        } else {
            res.status(404).json({ error: "Game not found in cart" });
        }
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/updateCart', async (req, res) => {
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
        const { game_id, quantity } = req.body;

        // ตรวจสอบว่าสินค้ามีคีย์ที่พร้อมใช้งานหรือไม่
        const [keyCountResult] = await db.query(
            `SELECT COUNT(*) AS available_keys FROM keygames WHERE game_id = ? AND key_used = 0`,
            [game_id]
        );

        const available_keys = keyCountResult[0].available_keys;

        if (quantity > available_keys) {
            return res.status(400).json({ error: `Only ${available_keys} keys are available for this game.` });
        }

        // อัปเดตจำนวนสินค้าในตะกร้า
        const [updateResult] = await db.query(
            `UPDATE cart SET quantity = ? WHERE user_id = ? AND game_id = ?`,
            [quantity, user_id, game_id]
        );

        if (updateResult.affectedRows > 0) {
            res.json({ success: true, message: "Cart updated successfully" });
        } else {
            res.status(400).json({ error: "Failed to update cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post('/pay', async (req, res) => {
    let connection;
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "No token found" });

        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        connection = await connectDB(); // Get a connection from the pool
        await connection.query('START TRANSACTION'); // Start the transaction manually

        // Get user_id from the database
        const [userResult] = await connection.query(
            `SELECT user_id FROM users WHERE username = ?`, 
            [username]
        );
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user_id = userResult[0].user_id;

        // Fetch items in the cart
        const [cartItems] = await connection.query(
            `SELECT cart.game_id, cart.quantity 
             FROM cart WHERE cart.user_id = ?`, 
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Your cart is empty" });
        }

        let orderTotal = 0;
        let orderItems = [];

        // Check if enough keys are available
        for (const item of cartItems) {
            const { game_id, quantity } = item;

            // Get the latest game price and price_id
            const [priceResult] = await connection.query(
                `SELECT history_id, game_price 
                 FROM historyprice 
                 WHERE historyprice.game_id = ? 
                 ORDER BY start_date DESC LIMIT 1`, [game_id]
            );

            const game_price = priceResult[0].game_price;
            const price_id = priceResult[0].history_id; // Get price_id

            orderTotal += game_price * quantity;

            // Get available keys for the game
            const [availableKeys] = await connection.query(
                `SELECT keygame FROM keygames WHERE game_id = ? AND key_used = 0 LIMIT ?`,
                [game_id, quantity]
            );

            if (availableKeys.length < quantity) {
                return res.status(400).json({ 
                    error: `Not enough keys available for game_id ${game_id}` 
                });
            }

            orderItems.push({
                game_id,
                keys: availableKeys.map(k => k.keygame),
                price: game_price,
                price_id // Add price_id to orderItems
            });
        }

        // Create an order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id) VALUES (?)`, [user_id]
        );
        const order_id = orderResult.insertId;

        // Insert order items into orderdetail table and update keys as used
        for (const item of orderItems) {
            for (const keygame of item.keys) {
                await connection.query(
                    `INSERT INTO orderdetail (order_id, keygame, game_id, price_id) VALUES (?, ?, ?, ?)`,
                    [order_id, keygame, item.game_id, item.price_id] // Insert price_id here
                );

                // Mark the key as used
                await connection.query(
                    `UPDATE keygames SET key_used = 1 WHERE keygame = ?`,
                    [keygame]
                );
            }
        }

        // Remove the purchased items from the cart
        await connection.query(`DELETE FROM cart WHERE user_id = ?`, [user_id]);

        await connection.query('COMMIT'); // Commit the transaction
        res.json({ success: true, message: "Payment successful!"});
    } catch (error) {
        console.error(error);
        if (connection) await connection.query('ROLLBACK'); // Rollback the transaction on error
        res.status(500).json({ error: "Server Error" });
    } finally {
        if (connection) await connection.end(); // Close the connection
    }
});




module.exports = router;