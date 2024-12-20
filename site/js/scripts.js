/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 
var user;
var fish;

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});


function loadUserData(username) {
    $.getJSON('data/userdata.json', function(data) {
        console.log(data);
        users = data.filter(user => user.username === username);
        if(users.length > 0){
            user = users[0];
        }
    }).fail(function(jqxhr, textStatus, error) {
        console.error('Request Failed: ' + textStatus + ', ' + error);
    });
    return user;
}

function loadFishData() {
    $.getJSON('data/fish.json', function(data) {
        console.log(data);
        fish = data;
    }).fail(function(jqxhr, textStatus, error) {
        console.error('Request Failed: ' + textStatus + ', ' + error);
    });
    return fish;
}


