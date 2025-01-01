// server.js
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2/promise');
const manageServer = require('./manageServer');
const cors = require('cors');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
        console.log('Database connected successfully');
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
