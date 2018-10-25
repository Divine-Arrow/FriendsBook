const passport = require("passport");
const LocalStrategy = require("passport-local");
const _ = require("lodash");

const User = require("../models/user");

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var bodyData = _.pick(req.body, ['name', 'email', 'password', 'confirmPassword']);
    console.log(JSON.stringify(req.body, undefined, 2));
    User.findOne({
        email
    }).then((existingUser) => {
        if (!existingUser) {
            // create a new user
            var newUser = User(bodyData);
            if (bodyData.password === bodyData.confirmPassword) {
                newUser.password = newUser.generateHash(bodyData.password);
            }
            newUser.save().then((response) => {
                console.log("response: ",response);
            }).catch((e) => {
                console.log(e);
            });
        }
    }).catch((e) => {
        console.log(e);
    });
    console.log("running ends");
}));