function goToApp() {
    console.log('red')
    window.location.replace("./app/index.html");
}
if (localStorage.getItem('privKey') && localStorage.getItem('pubKey')) {
    goToApp();
}

function processLogin(){
    
}