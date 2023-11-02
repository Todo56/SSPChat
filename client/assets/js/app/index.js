function logout(){
    localStorage.clear()
}

function isLoggedIn(){
    return localStorage.getItem('username') && localStorage.getItem('pubKey') && localStorage.getItem('privKey');
}

if(!isLoggedIn()){
    window.location.replace("../login.html")
}
