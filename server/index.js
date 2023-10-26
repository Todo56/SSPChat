let express = require('express');
let config = require("./config.json")
let app = express();
let port = config.app.port;
let utils = require('./utils.js')
let mysql = require('mysql2')
let con = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database
})
module.exports.con = con;

con.query(`
    CREATE TABLE IF NOT EXISTS users(
        userId INT AUTO_INCREMENT,
        username VARCHAR(32) NOT NULL,
        avatar VARCHAR(100) DEFAULT NULL,
        pubKey VARCHAR(94) NOT NULL,
        ePrivKey TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        active BOOL DEFAULT TRUE,
        PRIMARY KEY (userId)
    );
`, function(err, rows, fields) {
    if(err !== null){
        console.log('ERROR WHILE CREATING TABLE USERS')
    }
});

con.query(`
    CREATE TABLE IF NOT EXISTS chats(
        chatId INT AUTO_INCREMENT,
        userId1 INT NOT NULL,
        userId2 INT NOT NULL,
        creationDate INT NOT NULL,
        description TEXT DEFAULT NULL,
        PRIMARY KEY (chatId)
    );
`, function(err, rows, fields) {
    if(err !== null){
        console.log('ERROR WHILE CREATING TABLE CHATS')
    }
});

con.query(`
    CREATE TABLE IF NOT EXISTS message(
        messageId INT AUTO_INCREMENT,
        chatId INT NOT NULL,
        content INT NOT NULL,
        creationDate INT NOT NULL,
        userId INT NOT NULL,
        PRIMARY KEY (messageId)
    );
`, function(err, rows, fields) {
    if(err !== null){
        console.log('ERROR WHILE CREATING TABLE MESSAGE')
        console.log(err)
    }
});


app.use(express.json());

app.use(function(req, res, next) {
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
        return res.send({error: true, description: 'Please input all the required fields.'});
    }

    if (!utils.isAlphanumeric(username)) {
        return res.send({error: true, description: 'Username must only consist of alphanumeric characters.'});
    }

    if (!utils.isAlphanumeric(registerCode)) {
        return res.send({error: true, description: 'Register code must only consist of alphanumeric characters.'});
    }

    if (username.length > 20 || username.length < 3) {
        return res.send({error: true, description: 'Username must be between 3 and 20 characters.'});
    }

    if (registerCode.length !== 5) {
        return res.send({error: true, description: 'Register code must be exactly 5 characters long.'});
    }

    if(!config.app.registrationCodes.includes(registerCode)){
        return res.send({error: true, description: 'This register code is not valid.'});
    }

    console.log(pubKey, privKey)
    con.query(
        `INSERT INTO users (username, pubKey, ePrivKey, avatar) VALUES (?, ?, ?, ?)`,
        [username, pubKey, privKey, 'default.png'],
        function(err, results, fields){
            console.log(err)
            if(!err){
                return res.send({error: false, description: 'Success!'})
            } else {
                
                return res.send({error: true, description: 'There was a database issue while trying to create a new user. Contact the owner of this instance of SSP Chat for more information.'});
            }
    })
}); 

app.listen(port, () => {
    console.log('Listening.');
});
