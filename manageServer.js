const express = require('express');
const path = require('path');
const multer  = require('multer')
const router = express.Router(); // สร้าง router เพื่อจัดการเส้นทาง
const mysql = require('mysql2/promise');
const fs = require('fs');
const cors = require('cors');   
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const secretKey = 'nowgaming';

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
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
// การตั้งค่า diskStorage เพื่อจัดการชื่อไฟล์พร้อมนามสกุลเดิม
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'img', 'game')); // โฟลเดอร์ปลายทาง
    },
    filename: function (req, file, cb) {
        // สร้างชื่อไฟล์ใหม่โดยเก็บนามสกุลเดิม
        const originalExtension = path.extname(file.originalname); // ดึงนามสกุลไฟล์
        const uniqueSuffix = Date.now(); // เพิ่มเวลาเพื่อให้ชื่อไม่ซ้ำ
        cb(null, file.originalname); 
    }
});
const upload = multer({ 
    storage: storage
});

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

// เส้นทาง GET สำหรับแสดงหน้า manage
router.get('/', isAdmin,(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

router.post('/upload',isAdmin ,upload.single('game_imgfile'), async (req, res) => {
    
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { game_title, game_description, game_price, game_category } = req.body;
    const game_image = req.file.filename; // ใช้ชื่อไฟล์ที่เก็บไว้ในระบบ
    const connection = await connectDB();

    try {
        // ตรวจสอบเกมซ้ำในฐานข้อมูล
        const [existingGames] = await connection.query(
            'SELECT * FROM games WHERE LOWER(game_title) = ? AND game_deleted = 0',
            [game_title.toLowerCase()]
        );

        const [patch] = await connection.query(
            'SELECT * FROM games WHERE LOWER(game_title) = ? AND game_deleted = 1',
            [game_title.toLowerCase()]
        );

        if (patch.length > 0) {
            await connection.execute(
                `UPDATE games SET game_deleted = 0 WHERE game_id = ?`,
                [patch[0].game_id]
            );
            await connection.execute(`INSERT INTO historyprice (game_id,game_price) VALUES (?, ?)`,[patch[0].game_id,game_price]);
            return res.send({
                message: 'Game uploaded successfully!',
                gameId: patch[0].game_id,
                game_image: game_image
            });
        }

        if (existingGames.length > 0) {
            return res.status(400).send('มีเกมนี้ในระบบแล้ว');
        }

        // บันทึกข้อมูลลงในฐานข้อมูล (ไม่รวม key_amount)
        const [result] = await connection.execute(
            `INSERT INTO games (game_title, game_image, game_description,game_category) VALUES (?, ?, ?,?)`,
            [game_title, game_image, game_description,game_category]
        );

        await connection.execute(`INSERT INTO historyprice (game_id,game_price) VALUES (?, ?)`,[result.insertId,game_price]);
    
        res.send({
            message: 'Game uploaded successfully!',
            gameId: result.insertId, // ส่งกลับ ID ของเกมที่ถูกบันทึก
            game_image: game_image
        });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).send('Error saving game data.');
    }
});


router.get('/getGameToManage',isAdmin, async (req, res) => {
    const query = `
    SELECT 
    g.game_id, 
    g.game_title,
    g.game_image,
    g.game_description,
    hp.game_price, 
    hp.start_date,
    g.game_deleted,
    COUNT(k.keygame) AS key_count  -- นับจำนวนคีย์ของแต่ละเกมที่ยังไม่ได้ใช้งาน
FROM games g
JOIN historyprice hp ON g.game_id = hp.game_id
LEFT JOIN keygames k ON g.game_id = k.game_id AND k.key_used = 0  -- นับเฉพาะคีย์ที่ยังไม่ถูกใช้งาน
WHERE hp.start_date = (
    SELECT MAX(start_date)
    FROM historyprice
    WHERE game_id = g.game_id
)
GROUP BY g.game_id, g.game_title, g.game_image, g.game_description, 
         hp.game_price, hp.start_date, g.game_deleted
ORDER BY g.game_id;

    `;

    try {
        const connection = await connectDB();
        // ดึงข้อมูลเกมพร้อมราคาล่าสุด
        const [games] = await connection.query(query);
        
        // ส่งข้อมูลกลับไป
        res.send(games);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving game data.');
    }
});



router.patch('/deleteGame/:game_id', isAdmin, async (req, res) => {
    try {
        const { game_id } = req.params;
        
        const connection = await connectDB();
        
        // ตรวจสอบว่าเกมมีอยู่หรือไม่
        const [game] = await connection.query('SELECT * FROM games WHERE game_id = ?', [game_id]);
        if (game.length === 0) {
            return res.status(404).send('Game not Found');
        }

        // ลบ keygame ที่ยังไม่ได้ใช้ (key_used = 0)
        await connection.query('DELETE FROM keygames WHERE game_id = ? AND key_used = 0', [game_id]);

        // อัปเดตให้เกมถูกลบ (soft delete)
        const [result] = await connection.query('UPDATE games SET game_deleted = 1 WHERE game_id = ?', [game_id]);

        if (result.affectedRows > 0) {
            res.status(200).send(`Game with ID ${game_id} deleted successfully`);
        } else {
            res.status(500).send('Failed to delete game');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting game');
    }
});


//Edit
router.patch('/updateGame/:game_id', isAdmin,upload.single('game_imgfile'), async (req, res) => {
    const { game_id } = req.params;
    const { game_title, game_description, game_price } = req.body;
    const game_image = req.file ? req.file.filename : null; // ใช้ไฟล์ใหม่ถ้ามี

    try {
        const connection = await connectDB();

        // Step 1: Get current price from historyprice table
        const [currentPrice] = await connection.query(
            `SELECT game_price FROM historyprice WHERE game_id = ? ORDER BY start_date DESC LIMIT 1`,
            [game_id]
        );

        // Step 2: Update the game details (title, description)
        const updateQuery = `
            UPDATE games 
            SET game_title = ?, game_description = ? 
            WHERE game_id = ?
        `;
        await connection.execute(updateQuery, [game_title, game_description, game_id]);

        // Step 3: If new image is uploaded, update the image as well
        if (game_image) {
            await connection.execute(`
                UPDATE games 
                SET game_image = ? 
                WHERE game_id = ?`, [game_image, game_id]);
        }
        const currentPriceValue = parseFloat(currentPrice[0].game_price);
        const newPriceValue = parseFloat(game_price);

        // Step 4: Insert new price into historyprice if it has changed
        if (currentPrice.length === 0 || currentPriceValue.toFixed(2) !== newPriceValue.toFixed(2)) {
            await connection.execute(`
                INSERT INTO historyprice (game_id, game_price, start_date) 
                VALUES (?, ?, NOW())`, [game_id, game_price]);
        } else {
            // ไม่ต้อง insert ถ้าราคาไม่เปลี่ยน
            console.log('Price is the same, no need to update');
        }
        

        res.send({ message: 'Game updated successfully' });
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).send('Error updating game');
    }
});


router.get('/getGameDetails/:game_id',isAdmin, async (req, res) => {
    const { game_id } = req.params;
    try {
        const connection = await connectDB();
        
        if (!connection) {
            throw new Error('Database connection failed');
        }

        const [gameDetails] = await connection.query('SELECT * FROM games WHERE game_id = ?', [game_id]);
        
        if (gameDetails.length === 0) {
            return res.status(404).send('Game not found');
        }

        const [historyPrice] = await connection.query(
            `SELECT game_price FROM historyprice WHERE game_id = ? ORDER BY start_date DESC LIMIT 1`, 
            [game_id]
        );

        if (historyPrice.length === 0) {
            return res.status(404).send('Price history not found');
        }

        const gameDetail = gameDetails[0];
        res.send({
            ...gameDetail,
            game_price: historyPrice[0].game_price
        });
    } catch (error) {
        console.error('Error fetching game details:', error);
        res.status(500).send('Error fetching game details');
    }
});

router.post('/getKeyGameIMG',async (req,res)=>{
    const {gameId} = req.body;
    const db = await connectDB();
    const [games] = await db.query(`SELECT * FROM games WHERE game_id = ?`,[gameId]);
    res.send(games);
});

router.post('/addkey', async (req, res) => {
    const { game_id, keygame } = req.body;
    const db = await connectDB();
    try {
        // เพิ่มคีย์ใหม่ในฐานข้อมูล
        await db.query('INSERT INTO keygames (keygame, game_id) VALUES (?, ?)', [keygame, game_id]);

        // ดึงข้อมูลคีย์ทั้งหมดเพื่อส่งกลับ
        const [allKey] = await db.query('SELECT * FROM keygames WHERE game_id = ?', [game_id]);
        res.send(allKey); // ส่งข้อมูลกลับไปยัง Client
    } catch (error) {
        if (error.errno === 1452) {
            res.status(400).send('Foreign Key Constraint failed: The referenced row does not exist.');
        } else if (error.errno === 1062) {
            res.status(400).send('มีคีย์เกมนี้ในระบบแล้ว');
        } else {
            res.status(500).send('An unexpected error occurred.');
        }
    }
});


router.post('/getKeyGame',async (req,res)=>{
    try{
        const {game_id} = req.body;
        const db = await connectDB();
        const [allKey] = await db.query('SELECT * FROM keygames WHERE game_id = ? AND key_used = 0',[game_id]);
        if (allKey.length === 0) {
            return res.status(400).send('ไม่พบคีย์ของเกมนี้ในระบบ');
        }
        res.send(allKey);
    }
    catch(error){
        console.error('Error occurred:', error); 
        res.status(400).send('ไม่พบคีย์ของเกมนี้ในระบบ');
    }
});

router.delete('/deletekey',async (req,res)=>{
    const keygame = req.query.keygame; 
    const db = await connectDB();
    try{
        const query = `
            DELETE FROM keygames WHERE keygame = ? 
        `;
        await db.query(query,keygame);
        res.send("Delete Key Game Success");
    }catch(error){
        res.send(error);
    }
});

module.exports = router; // ส่ง router ไปใช้งานใน index.js
