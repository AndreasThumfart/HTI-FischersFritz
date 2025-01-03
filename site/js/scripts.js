
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
            user = data.find(user => user.username === username);
            if(user){
                sessionStorage.setItem('user', JSON.stringify(user));
            }
            else {
                alert("user not found");
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
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<li class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ Date(userHistory[i].date).toString() +"</p></li>");

        }
    }
}
function renderProfileHistoryFiltered(historyDiv,filter){
    var filterDate = getFilterDate(filter);
    historyDiv.empty();
    var userHistory = user.history.filter(h => (new Date(h.date)).getTime() >= filterDate);
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<li class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ Date(userHistory[i].date).toString() +"</p></li>");
        }
    }
}

function renderHistory(historyDiv){
    var userHistory = user.history;
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<li class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ Date(userHistory[i].date).toString() +"</p></li>");
        }
    }
}

function renderHistoryFiltered(historyDiv,filter){
    var filterDate = getFilterDate(filter);
    var userHistory = user.history.filter(h => (new Date(h.date)).getTime() >= filterDate);
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<li class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ Date(userHistory[i].date).toString() +"</p></li>");
        }
    }
}

function getFilterDate(filter){
    var filterDate = new Date();
    switch(filter){
        case "d":
            filterDate.setDate(filterDate.getDate() -1);
            break;
        case "w":
            filterDate.setDate(filterDate.getDate() -7);
            break;
        case "m":
            filterDate.setMonth(filterDate.getMonth() -1);
            break;
        case "y":
            filterDate.setFullYear(filterDate.getFullYear() -1);
            break;
        default:
            break;
    }
    return filterDate;
}


function renderHistoryDetails(historyDiv,id){
    var item = user.history.find(i => i.id === id);
    if(item){
        var f = fish.find(f => f.id === item.fish);
        if(f){
            historyDiv.append("<div class=\"history-item\"><a href=\"history-detail.html?id="+ item.id +"\"><h3>" + f.name + "</h3></a><p>"+ Date(item.date).toString() +"</p></div>");
        }
    }
}


function saveCatch(){
    //add catch to user history

    var item = {};
    if($("input#fishid").val()){
        item.fish = $("input#fishid").val();
    }
    else{
        var f= fish.find(f => f.name = $("input#fish").val());
        item.fish = f.id;
    }
    
    item.weigth = $("input#weight").val();
    item.length = $("input#length").val();
    item.notes = $("input#notes").val();
    item.location = $("input#location").val();
    item.date = $("#date").val() + "T" +$("#time").val() + ":00";
    item.spot = $("select#spot").val();
    item.bait = $("select#bait").val();
    item.technique = $("input#technique").val();
    item.weather = $("input#weather").val();
    item.waterTemp = $("input#watertemp").val();

    user.history.push(item);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.removeItem("caughtFish");
    window.location = "index.html";
}

function resetCatch(){
    sessionStorage.removeItem("caughtFish");
    window.location = "index.html";
}

function updateCatchForm(caughtFish){
    var caughtFish;
    if (sessionStorage.getItem("caughtFish")){
        caughtFish = JSON.parse(sessionStorage.getItem('caughtFish'));
        
        var curFish = fish.find(f => f.id === caughtFish.id);
        $("img#fish-icon").attr("src",curFish.img);
        $("input#fishid").val(caughtFish.id);
        $("input#fish").val(caughtFish.name);
        $("input#weight").val(caughtFish.weight);
        $("input#length").val(caughtFish.length);
        $("#fish-label").text(caughtFish.name);
        
    }
}

function searchFish(){
    //show search text box
    //search fish.json database for name
    //search box with selection after entering 3 characters?

    $("#fish-label").hide();
    $("input#fish").show();

}

var caughtFish;

function selectFish(){
    if(caughtFish){
        sessionStorage.setItem("caughtFish",JSON.stringify(caughtFish));
        window.location= "catch.html?fish=1";
    }
    else{
        //do nothing
    }
    
}

function scanFish(elem){
    //upload file, simulate scan
    //set value in session
    //let input = elem.files[0];
    var file = elem.files[0];
    // Show the spinner
    $("#spinner").show();
    
    //random number to get random fish
    var max = fish.length;
    var fishRand = Math.floor(Math.random() * (max - 0));

    var curFish = fish[fishRand];

    // Simulate file upload process
    setTimeout(function() {
        // Hide the spinner after the upload process is complete
        $("#spinner").hide();
        var reader = new FileReader(); 
        reader.onload = function(e) {
            // Hide the spinner
            $("#spinner").hide();
            
            // Display the file
            if (file.type.startsWith("image/")) {
                $("img#fish-image").attr("src", e.target.result);
                $("img#fish-image").show();
                $("#fish-scan-label").hide();

            } else {
                var text = $("<p>").text("File uploaded: " + file.name);
                fileDisplayArea.html(text);
            }
        };    
        reader.readAsDataURL(file);

        //generate random number for size and weight and calculate weight between 1 and 5, length between 30 and 80 
        var rand = Math.random();
        var weight = Math.round((rand *(4)+ 1)*100)/100;
        var length = Math.round(rand * (50) + 30);
        $("input#weight").val(weight);
        $("input#length").val(length);
        $("input#fish").val(curFish.id);
        $("#fish-label").text(curFish.name);
        $("#fish-icon").attr("src",curFish.img);

        caughtFish = {id: curFish.id, name:curFish.name, length:length,weight:weight};

        $("button#selectFish").removeAttr('disabled');

        //alert("Fisch erkannt!");
    }, 2000); // Simulate a 3-second upload time
}
