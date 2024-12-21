
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

function getParameterByName(name) {
    var url = window.location.search.substring(1);
    var parameters = url.split('&');
    for (var i = 0; i < parameters.length; i++) {
        var parameter = parameters[i].split('=');
        if (parameter[0] === name) {
            return parameter[1];
        }
    }
    return null;
}

function loadUserData(username) {
    if (sessionStorage.getItem("user")){
        user = JSON.parse(sessionStorage.getItem('user'));
    }
    else{
        $.getJSON('data/userdata.json', function(data) {
            console.log(data);
            users = data.filter(user => user.username === username);
            if(users.length > 0){
                user = users[0];
                sessionStorage.setItem('user', JSON.stringify(user));
                var obj = JSON.parse(sessionStorage.getItem('user'));
            }
        }).fail(function(jqxhr, textStatus, error) {
            console.error('Request Failed: ' + textStatus + ', ' + error);
        });
    }
}

function loadFishData() {
    if (sessionStorage.getItem("fish")){
        fish = JSON.parse(sessionStorage.getItem('fish'));
    }
    else{
        $.getJSON('data/fish.json', function(data) {
            console.log(data);
            fish = data;
            sessionStorage.setItem('fish', JSON.stringify(fish));
            
        }).fail(function(jqxhr, textStatus, error) {
            console.error('Request Failed: ' + textStatus + ', ' + error);
        });
    }
}


function renderProfileData(infoDiv){
    infoDiv.append("<p>" + user.name + "</p>");
    infoDiv.append("<p>" + Date(user.registration).toString() + "</p>");
}


function renderProfileHistory(historyDiv){
    var userHistory = user.history;
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.filter(f => f.id === userHistory[i].fish);
        if(f.length > 0){
            historyDiv.append("<div class=\"history-item\"><a href=\"history.html?id="+ userHistory[i].id +"\"><h3>" + f[0].name + "</h3></a></div>");
        }
    }
}

function renderHistory(historyDiv){
    var userHistory = user.history;
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.filter(f => f.id === userHistory[i].fish);
        if(f.length > 0){
            historyDiv.append("<div class=\"history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f[0].name + "</h3></a><p>"+ Date(userHistory[i].date).toString() +"</p></div>");
        }
    }
}

function renderHistoryDetails(historyDiv,id){
    var item = user.history.filter(i => i.id === id);
    if(item.length >0){
        var f = fish.filter(f => f.id === item[0].fish);
        if(f.length > 0){
            historyDiv.append("<div class=\"history-item\"><a href=\"history-detail.html?id="+ item[0].id +"\"><h3>" + f[0].name + "</h3></a><p>"+ Date(item[0].date).toString() +"</p></div>");
        }
    }
}