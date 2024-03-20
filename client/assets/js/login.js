function convertUIntArray8ToHex(arr) {
    let string = ""
    for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
        let str = element.toString(16)
        string = string + str + '.';
    }
    string = string.slice(0, -1);
    return string;
}

function convertHexToUInt8Array(arr){
    let finalAr = new Uint8Array(32);
    let values = arr.split('.');
    for (let i = 0; i < values.length; i++) {
        finalAr[i] = parseInt(values[i], 16);
    }
    return finalAr;
}

function goToApp() {
    window.location.replace("./app/index.html");
}
//if (localStorage.getItem('privKey') && localStorage.getItem('pubKey') && localStorage.getItem('privKey')) {
//    goToApp();
//}

function setErrorMessage(error) {
    errorSet = true;
    $('#message').html(error + '<br>');
}
let dataRecieved;
function processLogin(){
    console.log('Processing input')
    let username = $('#usernameInput').val();
    try {
        fetch(config.server + "api/login", {
            method: "POST",
            body: JSON.stringify({
                username: username
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => 
            response.json().then(data => {
                if(data.error){
                    setErrorMessage(data.description);
                    return;
                }
                $('#box').html(`
                <h3>Welcome ${data.data.username}!</h3>
                <hr />
                <p class='text-start'>Your public key is ${data.data.pubKey}, your private key is currently encrypted. Please input the password to decrypt your private key and be able to send messages.</p>
                <form>
                    <div class="form-group" id="nextData">
                        <label for="passwordInput">Password</label>
                        <input type="password" class="form-control" id="passwordInput" placeholder="Password">
                    </div>
                    <br>
                    <div id="message"></div>
                    <br>
                    <a class="button-34" role="button" onclick="processPassword()">Unencrypt</a>
                </form>
                `)
                dataRecieved = data.data;
            }));
    } catch (error) {
        console.log('caught error.')

        setErrorMessage('An error occured when trying to reach out to the server. Please contact the server administrator.')
    }

}

function processPassword(){
    let password = $('#passwordInput').val();
    try{
        let privKey = CryptoJS.AES.decrypt(dataRecieved.ePrivKey, password).toString(CryptoJS.enc.Utf8);
        privKey = convertHexToUInt8Array(privKey);
        localStorage.setItem('privKey', privKey);
        localStorage.setItem('pubKey', convertHexToUInt8Array(dataRecieved.pubKey));
        localStorage.setItem('username', dataRecieved.username);
        localStorage.setItem('ePrivKey', dataRecieved.ePrivKey);
        goToApp();
    } catch( e){
        console.log(e)
        setErrorMessage('You have entered the wrong password. Failed to decrypt private key.')
    }

}