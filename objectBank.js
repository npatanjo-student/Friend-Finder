const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Users = new Schema ({
    username : String,
    password : String, 
    fullName : String,
    photo : String,
    age : Number,
    location : String,
    bio : String,
    interests : [],
    messages : []
});

var Messages = new Schema ({
    userID : [],
    messages : String,
    time : String
});

var Interests = new Schema ({
    interest : String,
    weight: Number
});

export {Users, Messages, Interests};