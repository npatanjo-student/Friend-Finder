/*
    AUTHORS: Nate Patanjo, Nick Marquis
    FILE: client.js
    ASSIGNMENT: Final Project
    COURSE: CSc 337; Summer 2021
    PURPOSE: 
*/
function update() {
    $.ajax({
        url: '/some/path',
        data: { name: 'Joe' },
        method: 'GET',
        success: function( result ) {
            alert(result);
        }
    });
}

function createAccount() {
    let u = $("#signupUsername").val();
    let p = $("#signupPassword").val();
    let n = $("#signupFullName").val();
    $.ajax({
        url: "/add/user/" + u + "/" + p + "/" + n,
        method: "GET",
        success: function (result) {alert("User added");}
    });
}

function login() {
    let u = $("#loginUsername").val();
    let p = $("#loginPassword").val();
    $.ajax ({
      url: "/login/" + u + "/" + p,
      method: "GET",
      success: function (result) {
        if (result == "BAD") {
          alert(result);
        } else {
          let url = "/home.html";
          window.location = url;
        }
      }
    });
  }

function saveProfile() {
    let interestsList = [];
    let bio = $("editUserBio").val();
    let img = $("editUserImage").val();
    let fullName = $("editUserName").val();
    let age = $("editUserAge").val();
    let loc = $("editUserLocation").val();
    let interests = $("editUserInterests").val();

    let age_int = {interest : age, weight : 2};
    let age_str = JSON.stringify(age_int);

    let loc_int = {interest : loc, weight : 1};
    let loc_str = JSON.stringify(loc_int);

    let interestsSplit = interests.split(",");
    for (interest in interestsSplit) {
        let interest_JSON = {interest : interest, weight : 3};
        let interest_str = JSON.stringify(interest_JSON);
        interestsList.push(interest_str);
    }

    $.ajax ({
        url: "/save/",
        data: {bio : bio,
                img : img,
                fullName : fullName,
                age: age_str,
                loc: loc_str,
                interests : interestsList},
        method: "POST",
        success: function (result) {
            alert(result);
        }
    });
}

function userProfile() {
    window.location = "/userProfile.html"
}

function showUserProfile() {
    window.location = "/userProfile.html"
}

function displayConvoTabs(data) {
    var toReturn = '';
    for (key in data) {
        var username = key;
        var fullName = data[key];
        toReturn += '<a class="convoTabs" id="'+username+'" onclick="viewMessages('+username+');">'+ fullName +'</a>';
    }    
    return toReturn;
}

function viewConvos() {
    $.ajax ({
        url: "/messages/",
        method: "GET",
        success: function (result) {
            let results = displayConvoTabs(result);
            $('#conversations').html(results);
        }
    });
}

function displayMessages(data,username) {
    var toReturn = '';
    for (message in data) {
        if (message.substring(0,3) == "to:") {
            toReturn += '<div class="messageTo">' + message.substring(3) + '</div>';
        } else if (message.substring(0,3) == "fr:") {
            toReturn += '<div class="messageFrom">' + message.substring(3) + '</div>';
        }
    }
    toReturn += '<textarea class="textBox" rows="12" cols="24" id="messageEntry" value="" placeholder="Start a new message"></textarea>';
    toReturn += '<a id="sendMessageButton" onclick="sendMessage('+username+');">Send</a>';
    return toReturn;
}

function viewMessages(convoID) {
    $('.convoTabs').css('background-color','#ffffff');
    $('.convoTabs').css('width','95%');
    $(convoID).css('background-color','#lightgray');
    $(convoID).css('width','100%');

    $.ajax ({
        url: "/messages/" + convoID,
        method: "GET",
        success: function (result) {
            let results = displayMessages(result,convoID);
            $('#currentChat').html(results);
        }
    });
}

function sendMessage(convoID) {
    let message = $("messageEntry").val();
    let from = '';
    let toSend = {toID:convoID, fromID : from, messages:message}
    let toSend_str = JSON.stringify(toSend);

    $.ajax ({
        url: "/messages/" + convo + "/send",
        data: {message : toSend_str},
        method: "POST",
        success: function (result) {
            alert(result);
        }
    });
}

function editProfile() {
    window.location = "/editProfile.html"
}

function userMessages() {
    window.location = "/messages.html"
}
