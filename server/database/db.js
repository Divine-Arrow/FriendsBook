const User = require('../models/user');
const bcrypt = require('bcryptjs');

// scoped functions

const generateHash = (pass, callback) => {
    bcrypt.hash(pass, 8, (err, hash) => {
        if (err || !hash)
            return callback('error while hashing password');
        return callback(null, hash.replace(/\//gi, 'c'));
    });
};

// create Link
const createLink = (email, callback) => {
    generateHash(email, (err, hash) => {
        if (err || !hash)
            return callback('SWR');

        User.findOneAndUpdate({
            email
        }, {
            $set: {
                token: hash
            }
        }, {
            new: true
        }).then((updatedUser) => {
            if (!updatedUser)
                return callback('cannot update user token');
            return callback(null, hash)
        }).catch((e) => {
            if (e)
                return callback('SWR on updating token at db.js')
        });
    })
}
// verify link
const verifyToken = (token, callback) => {
    User.findOne({
        token
    }).then((user) => {
        if (!user)
            return callback(null, false);
        User.findByIdAndUpdate(user.id, {
            $set: {
                isVerified: true
            }
        }, {
            new: true
        }).then((verifiedUser) => {
            if (!verifiedUser)
                return callback('Token Found But SWR on updating');
            return callback(null, true);
        }).catch((e) => {
            if (e)
                return callback('Token Found But SWR on updating');
        })
    }).catch((e) => {
        if (e)
            return callback('SWR on verifying token at db.js')
    });
}


// createPass
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
    findit,
    createLink,
    verifyToken
}