function goToApp(){
    console.log('red')
    window.location.replace("./app/index.html");
}

function convertUIntArray8ToHex(arr){
    let string = ""
    for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
        let str = element.toString(16)
        console.log(str)
        string = string + str + '.';
    }
    string = string.slice(0, -1);
    return string;
}

function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};

function passwordValidation(pass) {
    return /^[\x00-\x7F]+$/.test(pass);
}

let errorSet = false;
function setErrorMessage(error) {
    errorSet = true;
    $('#message').html(error + '<br>');
}

if(localStorage.getItem('privKey') && localStorage.getItem('pubKey')){
    goToApp();
}

function processRegistration() {
    setErrorMessage('')
    errorSet = false;
    let username = $('#emailInput').val();
    let password1 = $('#passwordInput').val();
    let password2 = $('#passwordInput2').val();
    let registerCode = $('#registerCode').val();

    if (username == '' || password1 == '' || password2 == '' || registerCode == '') {
        setErrorMessage('Please input all the required fields.');
    }

    if (!isAlphaNumeric(username)) {
        setErrorMessage('Username must consist of only alphanumeric characters.')
    }

    if (!isAlphaNumeric(registerCode)) {
        setErrorMessage('Register code must consist of only alphanumeric characters.')
    }

    if (username.length > 20 || username.length < 3) {
        setErrorMessage('Username must be between 3 and 20 characters.')
    }

    if (password1.length > 32 || password1.length < 8) {
        setErrorMessage('Password must be between 8 and 32 characters.')
    }

    if (registerCode.length != 5) {
        setErrorMessage('Register code must be exactly 5 characters.')
    }

    if (password2 != password1) {
        setErrorMessage('Passwords do not match.')
    }

    if(!passwordValidation(password1)){
        setErrorMessage('Password contains characters which are not allowed.')
    }

    // Username between 3-20 alphanumeric characters.
    // password between 8-32 characters
    // register code 10 alphanumeric characters.

    if (!errorSet) {
        keyPair = nacl.box.keyPair();
        privKey = convertUIntArray8ToHex(keyPair.secretKey);
        pubKey = convertUIntArray8ToHex(keyPair.publicKey);
        let privKeyEnc = CryptoJS.AES.encrypt(privKey, password1).toString();
        console.log({
            username: username,
            pubKey: pubKey,
            privKey: privKeyEnc,
            registerCode: registerCode
        })
        fetch(config.server + "api/register", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                pubKey: pubKey,
                privKey: privKeyEnc,
                registerCode: registerCode
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => 
            response.json().then(data =>{
                console.log(data)
                if(data.error){
                    setErrorMessage(data.description)
                } else {
                    localStorage.setItem('privKey', privKeyEnc)
                    localStorage.setItem('pubKey', pubKey)
                    localStorage.setItem('username', username);

                }
        }));   

    }
}
