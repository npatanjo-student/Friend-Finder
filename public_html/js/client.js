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
    $.ajax({
        url: "/add/user/" + u + "/" + p + "/" + n,
        method: "GET",
        success: function (result) {alert(result);}
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

function saveProfileEdits() {
    let interestsList = [];
    //let bio = $("editUserBio").val();
    //let img = $("editUserImage").val();
    //let fullName = $("editUserName").val();
    //let age = $("editUserAge").val();
   // let loc = $("editUserLocation").val();
//    let interests = $("editUserInterests").val();
    let bio = document.getElementById("editUserBio").value;
    let img = document.getElementById("editUserImage").value;
    let fullName = document.getElementById("editUserName").value;
    let age = document.getElementById("editUserAge").value;
    let loc = document.getElementById("editUserLocation").value;
    let interests = document.getElementById("editUserInterests").value;

    let age_int = {interest : age, weight : 3};
    let age_str = JSON.stringify(age_int);

    let loc_int = {interest : loc, weight : 2};
    let loc_str = JSON.stringify(loc_int);

    let interestsSplit = interests.split(", ");
    for (interest in interestsSplit) {
        let interest_JSON = {interest : interestsSplit[interest], weight : 1};
        let interest_str = JSON.stringify(interest_JSON);
        interestsList.push(interest_str);
    }
    let interestsJSON = JSON.stringify(interestsList);

    $.ajax ({
        url: "/save/",
        data: {bio : bio,
                img : img,
                fullName : fullName,
                age: age_str,
                loc: loc_str,
                interests : interestsJSON},
        method: "POST",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                alert(result);
                userProfile()
            }
        }
    });
}

function showEditProfile() {
    $.ajax ({
        url: "/profile/",
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                console.log(result);
                console.log(result['fullName']);
                $('#editUserName').val(result['fullName']);
                console.log(result['age']);
                $('#editUserAge').val(result['age']);
                console.log(result['location']);
                $('#editUserLocation').val(result['location']);
                console.log(result['bio']);
                $('#editUserBio').val(result['bio']);
                console.log(result['interests']);
                $('#editUserInterests').val(result['interests']);
            }
        }
    });
}

function userProfile() {
    window.location = "/userProfile.html"
}

function showUserProfile() {
    $.ajax ({
        url: "/profile/",
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                $('#userName').text(result['fullName']);
                $('#userImage').text(result['photo']);
                $('#userAge').text(result['age']);
                $('#userLocation').text(result['location']);
                $('#userBio').text(result['bio']);
            }
        }
    });
}

function displayConvoTabs(data) {
    console.log('data');
    console.log(data);
    var toReturn = '';
    for (key in data) {
        var username = key;
        var fullName = data[key][0];
        var photo = data[key][1];
        toReturn += '<div class="convoTabs">';
        toReturn += '<div class="image-cropper-tab"><a class="friendFullNameTab" onclick="viewMessages('+username+');">'+ fullName +'</a></div>';
        toReturn += '<img src="img/'+photo+'" alt="User Image">';
        toReturn += '</div>';
        console.log('toReturn');
        console.log(toReturn);
    }
    console.log('last toReturn');
    console.log(toReturn);
    $('#conversations').html(toReturn);;
}

function viewConvos() {
    $.ajax ({
        url: "/messages/",
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                displayConvoTabs(result);
            }
        }
    });
}

function displayMessages(data,username) {
    var toReturn = '';
    for (message in data) {
        if (message.substring(0,3) == "to:") {
            if (message == "to:Start of Conversation") {
                toReturn += '<div class="firstMessage">' + message.substring(3) + '</div>';
            } else {
                toReturn += '<div class="messageTo">' + message.substring(3) + '</div>';
            }
        } else if (message.substring(0,3) == "fr:") {
            toReturn += '<div class="messageFrom">' + message.substring(3) + '</div>';
        }
    }
    toReturn += '<textarea class="textBox" rows="12" cols="24" id="messageEntry" value="" placeholder="Start a new message"></textarea>';
    toReturn += '<a id="sendMessageButton" onclick="sendMessage('+username+');">Send</a>';
    return toReturn;
}
function displayFriend(data,username) {
    var fullName = data[0];
    var photo = data[1];
    data.splice(0,2);

    toReturn += '<div class="userInfo">';
    toReturn += '<div class="image-cropper"> <img class="friendPhoto" src="img/'+photo+'" alt="User Image" onclick="viewFriendProfile('+username+');"></div>';
    toReturn += '<div class="friendFullName">'+fullName+'</div>';
    toReturn += '</div>';
    toReturn += '<div id="currentChat"></div>';
    return toReturn;
}

function viewMessages(convoID) {
    $('.convoTabs').css('background-color','#ffffff');
    $('.convoTabs').css('width','90%');
    $(convoID).css('background-color','#lightgray');
    $(convoID).css('width','100%');

    $.ajax ({
        url: "/messages/" + convoID,
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                let results = displayMessages(result,convoID);
                let friend = displayMessages(result,convoID);
                $('#messagesRight').html(friend);
                $('#currentChat').html(results);
                $("#currentChat").scrollTop($("#currentChat")[0].scrollHeight);
            }
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
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                alert(result);
            }
        }
    });
}

function editProfile() {
    window.location = "/editProfile.html"
}

function userMessages() {
    window.location = "/messages.html"
}

function messageMatch(username) {
    let message = 'Start of Conversation';
    let from = '';
    let toSend = {toID:username, fromID : from, messages:message}
    let toSend_str = JSON.stringify(toSend);

    $.ajax ({
        url: "/messages/" + username + "/send",
        data: {message : toSend_str},
        method: "POST",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                console.log("OK");
                window.location = "/messages.html";
                viewMessages(username);
            }
        }
    });
}

function skipProfile(username) {
    $.ajax ({
        url: "/skip/match",
        method: "POST",
        data: {user : username},
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                alert(result);
            }
        }
    });
    showMatch();
}

function showMatch() {
    $.ajax ({
        url: "/get/matches",
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                $('#matchName').text(result['fullName']);
                $('#matchImage').text(result['photo']);
                $('#matchAge').text(result['age']);
                $('#matchLocation').text(result['location']);
                $('#matchBio').text(result['bio']);
                $('#homeLeftOptions').html('<a id="messageMatchButton" onclick="messageMatch(\''+result['username']+'\');">Message</a> <a id="skipProfileButton" onclick="skipProfile(\''+result['username']+'\');">Skip Profile</a>');
            }
        }
    });
}

function viewFriendProfile(username) {
    window.location = "/friendProfile.html";

    $.ajax ({
        url: "/profile/"+username,
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                $('#friendName').text(result['fullName']);
                $('#friendImage').text(result['photo']);
                $('#friendAge').text(result['age']);
                $('#friendLocation').text(result['location']);
                $('#friendBio').text(result['bio']);
                $('#friendOptions').html('<a id="messageFriendButton" onclick="messageFriend('+username+');">Message</a> <a id="deleteFriendButton" onclick="deleteFriend('+username+');">Delete Friend</a>');
            }
        }
    });
}

function messageFriend(username) {
    window.location = "/messages.html";

    viewMessages(username);
}

function deleteFriend(username) {
    $('#friendOptions').html('<a id="doDeleteFriendButton" onclick="reallyDeleteFriend('+username+');">Delete</a> <a id="dontDeleteFriendButton" onclick="viewFriendProfile('+username+');">Go Back</a>');
}

function reallyDeleteFriend(username) {
    $.ajax ({
        url: "/delete/"+username,
        method: "GET",
        success: function (result) {
            if (result == 'NOT ALLOWED') {
                alert('Please log in');
                window.location = "/login.html"
            } else {
                alert(result);
            }
        }
    });
}