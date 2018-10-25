const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// mongoose.connect("mongodb://localhost/friendsBook");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    }
});

userSchema.methods.generateHash = pass => bcrypt.hashSync(pass, 8);

userSchema.methods.validHash = function(enteredPass) {
    bcrypt.compare(enteredPass, this.password, function(err, res) {
        if(!err) {
            return res;
        }
    });
}

const users = mongoose.model('users', userSchema);

module.exports = users;