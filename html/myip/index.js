// Defining async function
async function getapidata() {

    // First the user stats...
    // Storing response
    const response1 = await fetch("https://adsb.oarc.uk/api/v3/myip");

    // Storing data in form of JSON
    var userdata = await response1.json();
    showuserstats(userdata);

    // Now site stats...
    // Storing response
    const response2 = await fetch("https://adsb.oarc.uk/api/v3/feedcount");

    // Storing data in form of JSON
    var sitedata = await response2.json();
    showsitestats(sitedata);
}

// Calling that async function
let intervalID = setInterval(() => {
        getapidata();
}, 10000);


// Function to update both stats panels
function showuserstats(data) {
    //Beast data
    if (data[0] == "No match!") {
        document.getElementsByClassName("beastdot")[0].style.backgroundColor = "red";
        document.getElementById("beaststats").hidden = true;
        document.getElementById("beaststatus").innerHTML = "You are not feeding Beast data!";
    } else {
        document.getElementsByClassName("beastdot")[0].style.backgroundColor = "green";
        document.getElementById("beaststats").hidden = false;
        document.getElementById("beaststatus").innerHTML = "You are feeding Beast data!";
        document.getElementById("bandwidth").innerHTML = data[0][2];
        document.getElementById("msgsec").innerHTML = data[0][4];
        document.getElementById("possec").innerHTML = data[0][5];
        document.getElementById("latency").innerHTML = data[0][7];
        document.getElementById("postotal").innerHTML = data[0][8];
    }

    //MLAT data
    if (data[1] == "No match!") {
        document.getElementsByClassName("mlatdot")[0].style.backgroundColor = "red";
        document.getElementById("mlatstats").hidden = true;
        document.getElementById("mlatstatus").innerHTML = "You are not feeding MLAT data!";
    } else {
        document.getElementsByClassName("mlatdot")[0].style.backgroundColor = "green";
        document.getElementById("mlatstats").hidden = false;
        document.getElementById("mlatstatus").innerHTML = "You are feeding MLAT data!";
        document.getElementById("mlatusername").innerHTML = data[1]["user"];
        document.getElementById("mlatmsgrate").innerHTML = data[1]["message_rate"];
        document.getElementById("mlatpeers").innerHTML = data[1]["peer_count"];
        document.getElementById("mlattimeout").innerHTML = data[1]["bad_sync_timeout"];
        document.getElementById("mlatoutlier").innerHTML = data[1]["outlier_percent"];
    }
}

// Function to update site feed count data
function showsitestats(data) {
    document.getElementById("beastcount").innerHTML = data[0];
    document.getElementById("mlatcount").innerHTML = data[1];
}
