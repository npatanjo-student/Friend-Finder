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