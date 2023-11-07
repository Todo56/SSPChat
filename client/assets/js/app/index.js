function logout() {
    localStorage.clear();
    window.location.replace("../index.html");
}

function isLoggedIn() {
    return localStorage.getItem('username') && localStorage.getItem('pubKey') && localStorage.getItem('privKey');
}

if (!isLoggedIn()) {
    window.location.replace("../login.html");
}





document.addEventListener("DOMContentLoaded", function (event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show')
                // change icon
                toggle.classList.toggle('bx-x')
                // add padding to body
                bodypd.classList.toggle('body-pd')
                // add padding to header
                headerpd.classList.toggle('body-pd')
            })
        }
    }

    showNavbar('header-toggle', 'sidebar', 'body-pd', 'header')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
        let otherWindows = document.querySelectorAll('.content');
        otherWindows.forEach(c => c.classList.add('window'));
        let elementId = this.id.substr(0, this.id.length - 4);
        let element = document.getElementById(elementId);
        element.classList.remove('window');


        console.log(elementId)
        console.log(this.id);
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // Your code to run since DOM is loaded and ready
});