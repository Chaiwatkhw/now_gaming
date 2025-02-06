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
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});





module.exports = router;