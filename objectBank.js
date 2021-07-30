const mongoose = require("mongoose");
const db = mongoose.createConnection("localhost", "test");

var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    username : String,
    password : String, 
    fullName : String,
    photo : String,
    age : Number,
    location : String,
    bio : String,
    interests : [{type: Schema.ObjectId, ref: "Interests"}],
    messages : [{type: Schema.ObjectId, ref: "Messages"}]
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

var User = mongoose.model("User", UserSchema);
var Messages = mongoose.model("Messages", MessagesSchema);
var Interests = mongoose.model("Interests", InterestsSchema);

module.exports = User, Messages, Interests;
