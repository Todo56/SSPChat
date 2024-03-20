const config = require("./config.json")
const utils = require('./utils.js')
const db = require('./modules/database.js')
const con = require('./modules/database.js').con;
const api = require('./modules/api.js');
const WebSocketServer = require('ws').WebSocketServer;
const url = require('node:url');

db.setup();
let app = api.start();

const wss = new WebSocketServer({
    port: config.app.websocket.port
});

console.log(`WebSocket server operating in port ${config.app.websocket.port}.`);
// TODO: moving ws stuff elsewhere.
wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true);
    ws.pubKey = parameters.query.pubKey;
    ws.hexPubKey = utils.intArrayToHex(ws.pubKey.split(','));
    ws.send('{"error": false, "message": "Connection was successful."}')
    ws.on('close', () => {

    })
    ws.on('message', data => {
        console.log(ws.pubKey)
        try {
            let info = JSON.parse(data.toString());
            switch (info.eventName) {
                case 'createChat':
                    console.log(info)
                    
                    con.query(`SELECT * FROM chats WHERE (userId1='${info.payload.reciever}' OR userId1='${ws.pubKey}) AND (userId1='${ws.pubKey}' OR userId1='${info.payload.reciever})' LIMIT 1;`,
                    function (err, results, fields) {
                        if (results.length == 1) {
                            return ws.send({type: 'msg', error: true, description: 'A chat with this user already exists!' })
                          }
                          con.query(`INSERT INTO chats(userId1, userId2, description) VALUES ('${ws.pubKey}', '${info.payload.reciever}', '${ws.pubKey}');`);

                        return  ws.send({type: 'msg', error: false, description: 'Chat created successfully.' })
                    });                    
                    break;
                case 'sendMessage':

                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log('Invalid JSON recieved.')
        }
    })

    ws.onerror = function () {
      console.log('websocket error')
    }
   });