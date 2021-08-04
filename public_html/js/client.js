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
    let bio = $("editUserBio").val();
    let img = $("editUserImage").val();
    let u = $("editUserName").val();
    let age = $("editUserAge").val();
    let loc = $("editUserLocation").val();
    $.ajax ({
        url: "/save/" + bio + "/" + img + "/" + u + "/" + age + "/" + loc,
        method: "GET",
        success: function (result) {
            alert("profile updated");
        }
    });
}

function userProfile() {
    window.location = "/userProfile.html"
}

function displayConvoTabs(data) {
    var toReturn = '';
    for (key in data) {
        var username = key;
        var fullName = data[key];
        toReturn += '<a class="convoTabs" onclick="viewMessages('+username+');">'+ fullName +'</a>';
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

function displayMessages(data) {
    var toReturn = '';
    for (message in data) {
        if (message.substring(0,3) == "to:") {
            toReturn += '<div class="messageTo">' + message.substring(3) + '</div>';
        } else if (message.substring(0,3) == "fr:") {
            toReturn += '<div class="messageFrom">' + message.substring(3) + '</div>';
        }
    }
    return toReturn;
}

function viewMessages(convoID) {

    $.ajax ({
        url: "/messages/" + convoID,
        method: "GET",
        success: function (result) {
            let results = displayMessages(result);
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


