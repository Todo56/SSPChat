console.log(config.ws)
let webSocket = new WebSocket(config.ws + '?pubKey=' + localStorage.getItem('pubKey'));

WebSocket.prototype.emit = function (eventName, payload) {
    console.log(eventName, payload);
    this.send(JSON.stringify({eventName, payload}));
}

webSocket.addEventListener("open", () => {
    console.log("Connected via websocket.");
});
webSocket.addEventListener("message", (msg) => {
    console.log(msg.data)
    let data = JSON.parse(msg.data)
    switch (data.type) {
        case 'notice':
            if(data.error){
                alert('AN ERROR OCCURRED: ' + data.description)
            } else {
                alert('INFO: ' + data.description)
            }
            break;
        case 'message':
            //todo 
            break;
    }

    console.log(msg);
})

function createChat(pubKey){
    webSocket.emit('createChat', {'reciever': pubKey, 'initialMessage': 'Hello! I am ' + localStorage.getItem('username') + '.'});
}

function sendChat(chatId, message){
    webSocket.emit('sendChat', {'chatId': chatId, 'message': message});
}
