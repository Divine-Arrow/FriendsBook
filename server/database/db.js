const User = require('../models/user');

const createPass = (id, pass, callback) => {
    User.findById(id).then((user) => {
        if (!user)
            return callback(404);
        User.findByIdAndUpdate(user.id, {
            $set: {
                password: user.generateHash(pass)
            }
        }, {
            new: true
        }).then((updatedUser) => {
            if (updatedUser) {
                return callback(null, true);
            }
        }).catch((e) => {
            console.log("**********", e);
            if (e)
                return callback('SWR at hashing');
        });
    }).catch((e) => {
        if (e)
            return callback('SWR');
    });
}

// Find ID
const findit = (email, callback) => {

    User.findOne({
        email
    }).then((user) => {
        if (!user)
            return callback(null, false);
        return callback(null, user.email)
    }).catch((e) => {
        console.log(e);
        if (e)
            return callback('SWR at Catch Block');
    });
}


module.exports = {
    createPass,
    findit
}