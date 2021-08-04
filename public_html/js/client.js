const { profile } = require("console");

/*
    AUTHORS: Nate Patanjo, Nick Marquis
    FILE: client.js
    ASSIGNMENT: Final Project
    COURSE: CSc 337; Summer 2021
    PURPOSE: 
*/

function createAccount() {
    let u = $("#signupUsername").val();
    let p = $("#signupPassword").val();
    let n = $("#signupFullName").val();
    let user = {
        username: u,
        password: p,
        fullName: n
    }
    let userStr = JSON.stringify(user);
    $.ajax({
        url: "/add/user",
        data: {user: userStr},
        method: "POST",
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
        method: "POST",
        success: function (result) {
            alert("profile updated");
        }
    });
}

function userProfile() {
    window.location = "/userProfile.html"
}

function userMessages() {
    $.ajax({
        url: "/messages",
        method: "GET",
        success: function (result) {
            var toReturn = "";
            for (message in result) {
                message.messages;
            }
        }
    });
}

function sendMessage() {
    let m = $("#messageTextBox").val();
    let u = 
    $.ajax({
        url: "/messages/send",
        data : {newMessage: message},
        method: "POST",
        success: function (result) {
            alert("message Sent");
        }
    });
}

function editProfile() {
    window.location = "/editProfile.html"
}


