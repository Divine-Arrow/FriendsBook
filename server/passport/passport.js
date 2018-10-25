const passport = require("passport");
const LocalStrategy = require("passport-local");
const _ = require("lodash");

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    console.log(req.body);
    const bodyData = _.filter(req.body, ['name', 'mail', 'password', 'confirmPassword']);
    console.log(bodyData);
}))