const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// mongoose.connect("mongodb://localhost/friendsBook");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    gender: String,
    googleId: String,
    name: String,
    lastName: String,
    gImage: String
});

userSchema.methods.generateHash = pass => bcrypt.hashSync(pass, 8);

userSchema.methods.validHash = function (enteredPass, callback) {
    if (!this.password)
        return callback(404);
    bcrypt.compare(enteredPass, this.password, function (err, res) {
        if (err) {
            return callback("error found while comparing password");
        }
        callback(null, res);
    });
}

const users = mongoose.model('users', userSchema);

module.exports = users;