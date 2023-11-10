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


let usersLoaded = false;

function createChat(pubKey) {

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

        if ('new' == elementId) {
            let usersElement = document.getElementById('users')
            fetch(config.server + "api/data/users", {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response =>
                response.json().then(data => {
                    usersElement.innerHTML = ''
                    for (let i = 0; i < data.data.length; i++) {
                        if (data.data[i].username !== localStorage.getItem('username')) {
                            usersElement.innerHTML = usersElement.innerHTML + `
                            <tr>
                                <th scope="row"><div class="small"><img width='35px' src="../assets/img/default.png" alt="Profile Picture"></div></th>
                                <td>${data.data[i].userId}</td>
                                <td>${data.data[i].username}</td>
                                <td><a class='btn btn-success' onclick='createChat("${data.data[i].pubKey}")'><i class='bx bx-message-dots nav_icon'></i></a></td>
                            </tr>
                        `;
                        }
                    }
                    usersLoaded = true
                    console.log(data)
                }))
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // Your code to run since DOM is loaded and ready
});