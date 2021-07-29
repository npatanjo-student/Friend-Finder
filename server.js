/*
    AUTHORS: Nate Patanjo, Nick Marquis
    FILE: server.js
    ASSIGNMENT: Final Project
    COURSE: CSc 337; Summer 2021
    PURPOSE: 
*/
import {Users, Messages, Interests} from "./objectBank.js"; // import already created schemas

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

app.use("/", express.static('public_html'))

mongoose.connect(mongoDBURL , { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post("add/user", (req, res) => {
    let userObj = JSON.parse(req.body.user);
    var user = new Users(userObj);
    user.save(function(err) {if (err) console.log("an error occurred");});
});

app.listen(3000, () => {
    console.log('server has started');
});