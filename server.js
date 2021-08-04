/*
    AUTHORS: Nate Patanjo, Nick Marquis
    FILE: server.js
    ASSIGNMENT: Final Project
    COURSE: CSc 337; Summer 2021
    PURPOSE: 
*/

const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());

const db = mongoose.connection;
const mongoDBURL = 'mongodb://localhost/auto';

var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    username : String,
    password : String, 
    fullName : String,
    photo : String,
    age : Number,
    location : String,
    bio : String,
    interests : [],
    messages : [{type: Schema.ObjectId, ref: "Messages"}]
});

var MessagesSchema = new Schema ({
    userID : [{type: Schema.ObjectId, ref: "User"}],
    messages : String,
    time : String
});

// var InterestsSchema = new Schema ({
//     interest : String,
//     weight: Number
// });

var User = mongoose.model("User", UserSchema);
var Messages = mongoose.model("Messages", MessagesSchema);
// var Interests = mongoose.model("Interests", InterestsSchema);
var sessionKeys = {};

app.use("/home.html", authentication);
app.use("/userProfile.html", authentication);
app.use("/", express.static('public_html'))

mongoose.connect(mongoDBURL , { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function updateSessions() {
  console.log('session update function');
  let now = Date.now();
  for (e in sessionKeys) {
    if (sessionKeys[e][1] < (now - 20000)) {
      delete sessionKeys[e];
    }
  }
}

setInterval(updateSessions, 2000);

function authentication(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
      let u = req.cookies.login.username;
      let key = req.cookies.login.key;
      if ( Object.keys(sessionKeys[u]).length > 0 && sessionKeys[u][0] == key) {
        next();
      } else {
        res.send('NOT ALLOWED');
      }
    } else {
      res.send('NOT ALLOWED');
    }
  }

app.post("/add/user", (req, res) => {
    let userObj = JSON.parse(req.body.user);
    var user = new User(userObj);
    user.save(function(err) {if (err) console.log("an error occurred");});
    console.log("New User Created");
});

app.get("/get/users/", (req, res) => {
    User.find({})
    .exec(function(error, results) {
      res.send(JSON.stringify(results, null, 2));
    });
  });

app.get("/login/:u/:p", (req, res) => {
  User.find({username: req.params.u, password: req.params.p}).exec(function(error,results) {
    if (results.length == 1) {
      let sessionKey = Math.floor(Math.random() * 1000);
      sessionKeys[req.params.u] = sessionKey;
      sessionKeys[req.params.u] = [sessionKey, Date.now()];
      res.cookie("login", {username: req.params.u, key: sessionKey}, {maxAge: 60000}); // make 60000
      res.send("logged in");
    } else {
      res.send("BAD");
    }
  });
});

app.get("/save/:bio/:img/:u/:age/:loc", (req, res) => {
  User.find({username: req.cookies.login.username}).exec(function(error, results) {
    if (req.params.age != null) { results.interests.push(req.params.loc); } // might need to change null to undefined
    if (req.params.loc != null) { results.interests.push(req.params.age); }
    if (req.params.bio != null) { results.interests.push(req.params.bio); }
    req.params.img == null ? results.img = "" : results.img = req.params.img;
  });
});

app.get("/messages", (req, res) => {
  if (authentication != "NOT ALLOWED") {
    let curUser = req.cookies.login.username;
    User.find({username: curUser})
    .exec(function(error,results) {
      let userMessages = results[0].messages;
      res.send(userMessages);
    });
  }
});

app.post("/messages/send", (req, res) => {
  let newMessage = JSON.parse(req.body.newMessage);
  if (authentication != "NOT ALLOWED") {
    let curUser = req.cookies.login.username;
    
    User.find({username: curUser})
    .exec(function(error,results) {
      let userMessages = results[0].messages;
      userMessages.push(newMessage);
      res.send("Sent");
    });
  }
});

app.listen(3000, () => {
    console.log('server has started');
});