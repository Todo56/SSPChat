let config = require("../config.json")
let mysql = require('mysql2')

let con = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database
})
module.exports.con = con;

module.exports.setup = function () {
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
`, function (err, rows, fields) {
        if (err !== null) {
            console.log('ERROR WHILE CREATING TABLE USERS')
        }
    });

    con.query(`
    CREATE TABLE IF NOT EXISTS chats(
        chatId INT AUTO_INCREMENT,
        userKey1 VARCHAR(94) NOT NULL,
        userKey2 VARCHAR(94) NOT NULL,
        creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        description TEXT DEFAULT NULL,
        PRIMARY KEY (chatId)
    );
`, function (err, rows, fields) {
        if (err !== null) {
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
`, function (err, rows, fields) {
        if (err !== null) {
            console.log('ERROR WHILE CREATING TABLE MESSAGE')
            console.log(err)
        }
    });
}