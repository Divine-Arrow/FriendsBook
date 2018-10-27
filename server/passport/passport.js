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
    console.log(JSON.stringify(req.body, undefined, 2));
    User.findOne({
        email
    }).then((existingUser) => {
        if (!existingUser) {
            // create a new user
            var newUser = User(bodyData);
            if (bodyData.password === bodyData.confirmPassword) {

                if (password.length < 6)
                    return done(null, null, req.flash('danger', 'password length must be more than 5'));

                newUser.password = newUser.generateHash(bodyData.password);
                newUser.save().then((user) => {
                    done(null, user.id, req.flash('success', 'Signed up successfully.'));
                }).catch((e) => {
                    if (e.code === 11000) {
                        console.log("email already exist");
                    }
                    console.log(e);
                });
            } else {
                done(null, undefined, req.flash('danger', 'Password fields does not match.'));
            }

        }
    }).catch((e) => {
        console.log(e);
    });
    console.log("running ends");
}));