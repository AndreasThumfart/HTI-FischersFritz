
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
        user.history = sortHistory(user.history);
    }
    else{
        $.getJSON('data/userdata.json', function(data) {
            console.log(data);
            user = data.find(user => user.username === username);
            if(user){
                user.history = sortHistory(user.history);
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
    infoDiv.append("<h3>" + user.name + "</h3>");
    // Konvertiere das Registrierungsdatum in ein gekürztes Format
    const formattedDate = new Date(user.registration).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    infoDiv.append("<h5>Mitglied seit: " + formattedDate + "</h5>");
}

/*Alte Render Funktion ohne Gruppierung für profile.html */
/*function renderProfileHistory(historyDiv){
    var userHistory = user.history;
    historyDiv.empty();
    const groupedFish = {};
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<div class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ (new Date(userHistory[i].date)).toString() +"</p></div>");

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
            historyDiv.append("<div class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ (new Date(userHistory[i].date)).toString() +"</p></div>");
        }
        
    }
}*/

/*
 Start:Neue Rendern und Gruppieren nach Fischart in profile.html
 */
 function renderProfileHistory(historyDiv) {
    // Zuerst den Inhalt des Containers leeren
    historyDiv.empty();

    // Gruppenobjekt für Fische erstellen
    const groupedFish = {};

    // Benutzerhistorie durchlaufen
    user.history.forEach(entry => {
        const fishEntry = fish.find(f => f.id === entry.fish);
        if (fishEntry) {
            if (!groupedFish[fishEntry.name]) {
                groupedFish[fishEntry.name] = {
                    count: 0,
                    fish: fishEntry
                };
            }
            groupedFish[fishEntry.name].count++;
        }
    });

    // Wrapper für horizontale Darstellung
    const rowDiv = $('<div class="fish-row d-flex flex-wrap justify-content-start"></div>');

    // Gruppierte Fische rendern
    for (const fishName in groupedFish) {
        const fishData = groupedFish[fishName];
        const itemHTML = `
        <a href="history.html" class="fish-card-link text-center m-2">
            <div class="fish-card text-center m-2" style="width: 150px;">
                <h4>${fishData.fish.name}</h4>
                <img src="${fishData.fish.img}" alt="${fishData.fish.name}" class="fish-image img-fluid" style="max-width: 100px; height: auto; margin-bottom:0px;">
                <h4>x ${fishData.count}</h4>
            </div>
        </a>
        `;
        rowDiv.append(itemHTML);
    }

    // Elemente in das Haupt-Container-Div einfügen
    historyDiv.append(rowDiv);
}

function renderProfileHistoryFiltered(historyDiv, filter) {
    // Berechne das Startdatum für den Filter
    const filterDate = getFilterDate(filter);
    historyDiv.empty();

    // Gruppenobjekt für Fische erstellen
    const groupedFish = {};

    // Benutzerhistorie filtern und durchlaufen
    user.history.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= filterDate) {
            const fishEntry = fish.find(f => f.id === entry.fish);
            if (fishEntry) {
                if (!groupedFish[fishEntry.name]) {
                    groupedFish[fishEntry.name] = {
                        count: 0,
                        fish: fishEntry
                    };
                }
                groupedFish[fishEntry.name].count++;
            }
        }
    });

    // Wrapper für horizontale Darstellung
    const rowDiv = $('<div class="fish-row d-flex flex-wrap justify-content-start"></div>');

    // Gruppierte Fische rendern
    for (const fishName in groupedFish) {
        const fishData = groupedFish[fishName];
        const itemHTML = `
            <a href="history.html" class="fish-card-link text-center m-2">
            <div class="fish-card text-center m-2" style="width: 150px;">
                <h4>${fishData.fish.name}</h4>
                <img src="${fishData.fish.img}" alt="${fishData.fish.name}" class="fish-image img-fluid" style="max-width: 100px; height: auto; margin-bottom:0px;">
                <h4>x ${fishData.count}</h4>
            </div>
        </a>
        `;
        rowDiv.append(itemHTML);
    }

    // Elemente in das Haupt-Container-Div einfügen
    historyDiv.append(rowDiv);
}
/*
Ende: Neue Rendern und Gruppieren nach Fischart in profile.html
*/

/*
 Start:Neue Rendern und Gruppieren nach Datum in history.html
 */
 function renderHistory(historyDiv) {
    console.log("Rendering full history...");

    // Sicherstellen, dass das Ziel-Element existiert
    if (historyDiv.length === 0) {
        console.error("Target element for rendering (#fishHistory) not found in DOM.");
        return;
    }
    // Historie leeren
    historyDiv.empty();
    // Gruppiere die Einträge nach Datum
    const groupedHistory = user.history.reduce((groups, entry) => {
        const dateKey = new Date(entry.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        console.log("Processing entry:", entry, "Date Key:", dateKey);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(entry);
        return groups;
    }, {});

    console.log("Grouped History:", groupedHistory);
    
    // Rendere die gruppierten Einträge
    for (const date in groupedHistory) {
        console.log("Processing Date Group:", date);

        const dateContainer = `
            <div class="date-group">
                <h4>${date}</h4>
                <div class="fish-list"></div>
            </div>
        `;
        console.log("Generated Date Container HTML:", dateContainer);

        const dateElement = $(dateContainer);
        const fishList = dateElement.find(".fish-list");

        groupedHistory[date].forEach(entry => {
            const fishEntry = fish.find(f => f.id === entry.fish);
            if (fishEntry) {
                console.log("Processing Fish Entry:", fishEntry);

                const fishItem = `
                   <a href="history-detail.html?id=${entry.id}" class="history-item">
                        <div class="list-group-item history-item fish-details">
                            <img src="${fishEntry.img}" alt="${fishEntry.name}" class="fish-image">
                            <div>
                                <h4>${fishEntry.name} um ${new Date(entry.date).toLocaleTimeString("de-DE")}</h4>
                                <h4>${fishEntry.location}</h4>
                            </div>
                        </div>
                    </a>
                `;
                console.log("Generated Fish Item HTML:", fishItem);

                fishList.append(fishItem);
            } else {
                console.warn("Fish not found for entry:", entry);
            }
        });

        historyDiv.append(dateElement);
    }

    console.log("Rendering complete.");
}

function renderHistoryFiltered(historyDiv, filter) {
    console.log("Rendering filtered history with filter:", filter);

    // Sicherstellen, dass das Ziel-Element existiert
    if (historyDiv.length === 0) {
        console.error("Target element for rendering (#fishHistory) not found in DOM.");
        return;
    }

    // Filterdatum berechnen
    const filterDate = getFilterDate(filter);
    console.log("Filter Date:", filterDate);

    // Einträge nach Filter filtern
    const filteredHistory = user.history.filter(h => new Date(h.date).getTime() >= filterDate);
    console.log("Filtered History:", filteredHistory);

    historyDiv.empty();

    // Gruppiere die gefilterten Einträge nach Datum
    const groupedHistory = filteredHistory.reduce((groups, entry) => {
        const dateKey = new Date(entry.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        console.log("Processing entry:", entry, "Date Key:", dateKey);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(entry);
        return groups;
    }, {});

    console.log("Grouped Filtered History:", groupedHistory);

    // Rendere die gruppierten Einträge
    for (const date in groupedHistory) {
        console.log("Processing Date Group:", date);

        const dateContainer = `
            <div class="date-group">
                <h4>${date}</h4>
                <div class="fish-list"></div>
            </div>
        `;
        console.log("Generated Date Container HTML:", dateContainer);

        const dateElement = $(dateContainer);
        const fishList = dateElement.find(".fish-list");

        groupedHistory[date].forEach(entry => {
            const fishEntry = fish.find(f => f.id === entry.fish);
            if (fishEntry) {
                console.log("Processing Fish Entry:", fishEntry);

                const fishItem = ` 
                    <a href="history-detail.html?id=${entry.id}" class="history-item">
                        <div class="list-group-item history-item fish-details">
                            <img src="${fishEntry.img}" alt="${fishEntry.name}" class="fish-image">
                            <div>
                                <h4>${fishEntry.name} um ${new Date(entry.date).toLocaleTimeString("de-DE")}</h4>
                                <h4>${fishEntry.location}</h4>
                            </div>
                        </div>
                    </a>
                `;
                console.log("Generated Fish Item HTML:", fishItem);

                fishList.append(fishItem);
            } else {
                console.warn("Fish not found for entry:", entry);
            }
        });

        historyDiv.append(dateElement);
    }

    console.log("Rendering filtered history complete.");
}
 /*
 Ende:Neue Rendern und Gruppieren nach Datum in history.html
 */

/*Alte Render Funktion ohne Gruppierung für history.html*/

/*function renderHistory(historyDiv){
    var userHistory = user.history;
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<div class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ (new Date(userHistory[i].date)).toString() +"</p></div>");
        }
    }
}
*/

/*function renderHistoryFiltered(historyDiv,filter){
    var filterDate = getFilterDate(filter);
    var userHistory = user.history.filter(h => (new Date(h.date)).getTime() >= filterDate);
    historyDiv.empty();
    for(var i = 0; i<userHistory.length;i++){
        var f = fish.find(f => f.id === userHistory[i].fish);
        if(f){
            historyDiv.append("<div class=\"list-group-item history-item\"><a href=\"history-detail.html?id="+ userHistory[i].id +"\"><h3>" + f.name + "</h3></a><p>"+ (new Date(userHistory[i].date)).toString() +"</p></div>");
        }
    }
}
*/
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

function sortHistory(history){
    history.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
      });
    return history;
}

function saveCatch(){
    //add catch to user history

    var item = {};
    if($("input#fishid").val()){
        item.fish =  parseInt($("input#fishid").val());
    }
    else{
        var f= fish.find(f => f.name = $("input#fish").val());
        item.fish = parseInt(f.id);
    }
    
    item.weigth = parseFloat($("input#weight").val());
    item.length = parseFloat($("input#length").val());
    item.notes = $("input#notes").val();
    item.location = $("input#location").val();
    item.date = $("#date").val() + "T" +$("#time").val() + ":00";
    item.spot = $("select#spot").val();
    item.bait = $("select#bait").val();
    item.technique = $("input#technique").val();
    item.weather = $("input#weather").val();
    item.waterTemp =  parseFloat($("input#watertemp").val());

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
