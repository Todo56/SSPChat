console.log(config.ws)
let webSocket = new WebSocket(config.ws + '?pubKey=' + localStorage.getItem('pubKey'));

WebSocket.prototype.emit = function (eventName, payload) {
    console.log(eventName, payload);
    this.send(JSON.stringify({eventName, payload}));
}

webSocket.addEventListener("open", () => {
    console.log("Connected via websocket.");
});

function createChat(pubKey){
    webSocket.emit('createChat', {'reciever': pubKey, 'initialMessage': 'Hello! I am ' + localStorage.getItem('username') + '.'});
}

function sendChat(pubKey, message){
    webSocket.emit('sendChat', {'reciever': pubKey, 'message': message});
}
