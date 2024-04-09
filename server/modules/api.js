const express = require('express');
const app = express();
const config = require("../config.json")
const utils = require('../utils.js')
const con = require('./database.js').con;
const port = config.app.port;
function start(){

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, PubKey, Auth, pubKey, pubkey, authentication");
        next();
      });

    app.use(express.json());
    
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
        if(req.headers.authentication == undefined || req.headers.pubkey == undefined){
            return res.send('{"type": "notice", "error": true, "description": "Invalid headers."}')
        }
        console.log('Surprise!')
        let key = utils.intArrayToHex(req.headers.pubkey.split(','))
        con.query(`SELECT * FROM users WHERE ePrivKey='${req.headers.authentication}' AND pubKey='${key}' LIMIT 1;`, function(err, results){
            if(results.length !== 1){
                return res.send('{"type": "notice", "error": true, "description": "Invalid credentials."}')
            } else {
                con.query(`SELECT * FROM chats WHERE userKey1= '${key}' OR userKey2='${key}';`, (err, results) =>{
                    if(results.length !== 1){
                        res.send(`{"type": "chats", "empty": true, "data": "This looks very empty! Start chatting."}`)
                    } else {
                        res.send(JSON.stringify({"type": "chats", "empty": false, "data": results}))
                    }
                })
            }
        })
    });
    
    app.get('/api/data/messages/:chatId', (req,res) =>{
        if(req.headers.authentication == undefined || req.headers.pubkey == undefined){
            return res.send('{"type": "notice", "error": true, "description": "Invalid headers."}')
        }
        let key = utils.intArrayToHex(req.headers.pubkey.split(','))
        con.query(`SELECT * FROM users WHERE ePrivKey='${req.headers.authentication}' AND pubKey='${key}' LIMIT 1;`, function(err, results){
            if(results.length !== 1){
                return res.send('{"type": "notice", "error": true, "description": "Invalid credentials."}')
            } else {
                console.log(req.params.chatId)
                con.query(`SELECT * FROM message WHERE chatId=${req.params.chatId} LIMIT 100;`, function(err, results){
                    console.log(err)
                    res.send(JSON.stringify({"type": "messages", "empty": false, "data": results}))
                })
            }
        })
    })
    
    app.listen(port, () => {
        console.log(`Listening port ${port}.`);
    });

    return app;
}

module.exports.start = start;
