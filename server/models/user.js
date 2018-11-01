const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// mongoose.connect("mongodb://localhost/friendsBook");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: String,
    name: String,
    lastName: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    birthday: String,
    gImage: String,
    fImage: String,
    gender: String,
    googleId: String,
    facebookId: String,
    ageRange: Number,
    hometown: String,
    location: String,
    token: String,
});

userSchema.methods.generateHash = (pass, callback) => {
    bcrypt.hash(pass, 8, (err, hash) => {
        if (err || !hash)
            return callback('error while hashing password');
        return callback(null, hash);
    });
};

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