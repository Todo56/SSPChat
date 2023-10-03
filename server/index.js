let express = require('express');
let config = require("./config.json")
let app = express();
let port = config.app.port;

function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}

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
    let privkey = req.body.privKey;
    let registerCode = req.body.registerCode;

    if (username === '' || pubKey === '' || privkey === '' || registerCode === '') {
        return res.send({error: true, description: 'Please input all the required fields.'});
    }

    if (!isAlphaNumeric(username)) {
        return res.send({error: true, description: 'Username must only consist of alphanumeric characters.'});
    }

    if (!isAlphaNumeric(registerCode)) {
        return res.send({error: true, description: 'Register code must only consist of alphanumeric characters.'});
    }

    if (username.length > 20 || username.length < 3) {
        return res.send({error: true, description: 'Username must be between 3 and 20 characters.'});
    }

    if (registerCode.length !== 5 || !config.app.registrationCodes.includes(registerCode)) {
        return res.send({error: true, description: 'Register code must be exactly 5 characters long.'});
    }


}); 

app.listen(port, () => {
    console.log('Listening.');
});
