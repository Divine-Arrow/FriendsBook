const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/friendsBook");

var userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    }
}); 


const users = mongoose.model('users', userSchema);

module.exports = users;