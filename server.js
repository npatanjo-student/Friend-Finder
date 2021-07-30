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

var sessionKeys = {};
app.use("/", express.static('public_html'))

mongoose.connect(mongoDBURL , { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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
    console.log("worked");
});

app.get("/get/users/", (req, res) => {
    User.find({})
    .populate("mfg")
    .exec(function(error, results) {
      res.send(JSON.stringify(results, null, 2));
    });
  });

app.listen(3000, () => {
    console.log('server has started');
});