console.log(config.ws)
let webSocket = new WebSocket(config.ws);

WebSocket.prototype.emit = function (eventName, payload) {
    this.send(JSON.stringify({eventName, payload}));
}

webSocket.addEventListener("open", () => {
    console.log("Connected via websocket.");
});

function createChat(pubKey){
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log('Creating chat...')
    webSocket.emit('createChat', {'dqwdwqd': pubKey});
}
