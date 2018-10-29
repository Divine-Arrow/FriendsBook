const User = require('../models/user');

const createPass = (id, pass, callback) => {
    User.findById(id).then((user) => {
        if(!user)
            return callback(404);
        User.findByIdAndUpdate(user.id, { $set: {password: user.generateHash(pass)}}, {new: true}).then((updatedUser) => {
            if(updatedUser) {
                return callback(null, true);
            }
        }).catch((e)=> {
            console.log("**********", e);
            if(e)
                return callback('SWR at hashing');
        });
    }).catch((e)=> {
        if(e)
            return callback('SWR');
    });
}

module.exports = {
    createPass
}