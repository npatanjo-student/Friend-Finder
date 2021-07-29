const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsersSchema = new Schema ({
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

var MessagesSchema = new Schema ({
    userID : [],
    messages : String,
    time : String
});

var InterestsSchema = new Schema ({
    interest : String,
    weight: Number
});

var Users = mongoose.model("Users", UsersSchema);
var Messages = mongoose.model("Messages", MessagesSchema);
var Interests = mongoose.model("Interests", InterestsSchema);

export {Users, Messages, Interests};