const express = require('express');
const config = require("./config.json")
const app = express();
const port = config.app.port;
const utils = require('./utils.js')
const db = require('./modules/database.js');
const con = require('./modules/database.js').con;
const WebSocketServer = require('ws').WebSocketServer;
const url = require('node:url');

db.setup();

// TODO: separate API
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/register', (req, res) => {
    let username = req.body.username;
    let pubKey = req.body.pubKey;
    let privKey = req.body.privKey;
    let registerCode = req.body.registerCode;

    if (username === '' || pubKey === '' || privKey === '' || registerCode === '') {
        return res.send({ error: true, description: 'Please input all the required fields.' });
    }

    if (!utils.isAlphanumeric(username)) {
        return res.send({ error: true, description: 'Username must only consist of alphanumeric characters.' });
    }

    if (!utils.isAlphanumeric(registerCode)) {
        return res.send({ error: true, description: 'Register code must only consist of alphanumeric characters.' });
    }

    if (username.length > 20 || username.length < 3) {
        return res.send({ error: true, description: 'Username must be between 3 and 20 characters.' });
    }

    if (registerCode.length !== 5) {
        return res.send({ error: true, description: 'Register code must be exactly 5 characters long.' });
    }

    if (!config.app.registrationCodes.includes(registerCode)) {
        return res.send({ error: true, description: 'This register code is not valid.' });
    }
    con.query(
        `INSERT INTO users (username, pubKey, ePrivKey, avatar) VALUES (?, ?, ?, ?)`,
        [username, pubKey, privKey, 'default.png'],
        function (err, results, fields) {
            console.log(err)
            if (!err) {
                return res.send({ error: false, description: 'Success!' })
            } else {

                return res.send({ error: true, description: 'There was a database issue while trying to create a new user. Contact the owner of this instance of SSP Chat for more information.' });
            }
        })
});

app.post("/api/login", (req, res) => {
    let username = req.body.username;
    if (username === '') {
        return res.send({ error: true, description: 'Please input all the required fields.' });
    }

    if (!utils.isAlphanumeric(username)) {
        return res.send({ error: true, description: 'Username must only consist of alphanumeric characters.' });
    }

    con.query(
        `SELECT * FROM users WHERE username=? LIMIT 1`,
        [username],
        function (err, results, fields) {
            if (results.length == 0) {
                return res.send({ error: true, description: 'User not found.' })
            }
            return res.send({ error: false, data: results[0] })
        })
});

app.get('/api/data/users', (req, res) => {
    con.query(
        `SELECT userId, username, avatar, pubKey FROM users WHERE active=1;`,
        function (err, results, fields) {
            return res.send({ error: false, data: results })
        })
});

app.get('/api/data/chats', (req,res) =>{
    console.log(req.headers)
    res.send("{'potato': 'a'}")
});

app.get('/api/data/messages/:chatId', (req,res) =>{

})

app.listen(port, () => {
    console.log(`Listening port ${port}.`);
});

const wss = new WebSocketServer({
    port: config.app.websocket.port
});

console.log(`WebSocket server operating in port ${config.app.websocket.port}.`);
// TODO: moving ws stuff elsewhere.
wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true);
    ws.pubKey = parameters.query.pubKey;

    ws.send('{"error": false, "message": "Connection was successful."}')
    ws.on('close', () => {

    })
    ws.on('message', data => {
        console.log(ws.url)
        try {
            let info = JSON.parse(data.toString());
            switch (info.eventName) {
                case 'createChat':
                    con.query('INSERT INTO chats()')
                    break;
                case 'sendMessage':

                    break;
                default:
                    break;
            }
            console.log(info)
        } catch (error) {
            console.log('Invalid JSON recieved.')
        }
    })

    ws.onerror = function () {
      console.log('websocket error')
    }
   });