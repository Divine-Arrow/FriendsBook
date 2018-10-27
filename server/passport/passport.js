const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('../models/user');
const _ = require("lodash");

passport.serializeUser((userId, done) => {
    done(null, userId)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    }).catch((e) => {
        if (e) console.log('error at deserialize');
    })
});


// Register
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var bodyData = _.pick(req.body, ['name', 'email', 'password', 'confirmPassword']);
    User.findOne({
        email
    }).then((existingUser) => {
        if (!existingUser) {
            // create a new user
            var newUser = User(bodyData);
            if (bodyData.password === bodyData.confirmPassword) {

                if (password.length < 6)
                    return done(null, undefined, req.flash('danger', 'password length must be more than 5'));

                newUser.password = newUser.generateHash(bodyData.password);
                newUser.save().then((user) => {
                    return done(null, user.id, req.flash('success', 'Signed up successfully.'));
                }).catch((e) => {
                    if (e.code === 11000) {
                        console.log("email already exist");
                    }
                    return done(null, undefined, req.flash('danger', 'Somthing went wrong.'));
                });
            } else {
                return done(null, undefined, req.flash('danger', 'Password fields does not match.'));
            }
        } else {
            return done(null, undefined, req.flash('danger', 'Email already registerd.'));
        }
    }).catch((e) => {
        return done(null, undefined, req.flash('danger', 'Password fields does not match.'));
    });
}));


// login
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        email
    }).then((user) => {
        if (!user)
            return done(null, undefined, req.flash('danger', 'You are not registered.'))
        user.validHash(password, (err, result) => {
            if (err)
                return done(null, undefined, req.flash('danger', err));
            if (result)
                return done(null, user.id);
        });
    }).catch((err) => {
        if (err)
            return done(null, undefined, req.flash('danger', 'Something went wrong.'))
    });
}));