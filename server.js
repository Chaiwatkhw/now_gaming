// server.js
const express = require('express');
const path = require('path');
const app = express();
const manageServer = require('./manageServer');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/manage', manageServer);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/getGame', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
