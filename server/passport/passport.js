const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const User = require('../models/user');
const keys = require('../keys/keys');
const _ = require("lodash");

passport.serializeUser((userId, done) => {
    done(null, userId);
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
                    if (user)
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
            return done(null, undefined, req.flash('danger', 'You are not registered.'));
        user.validHash(password, (err, result) => {
            if (err) {
                if (err === 404) {
                    // pass data to routes.js
                    return done(null, null, req.flash('danger', `<a href="/createPass/${user.id}"><strong>forget</strong></a> password or use Oauth.`));
                }
                return done(null, undefined, req.flash('danger', err));
            }
            if (result)
                return done(null, user.id);
        });
    }).catch((err) => {
        if (err)
            return done(null, undefined, req.flash('danger', 'Something went wrong.'))
    });
}));

// google oauth
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/oauth/google/redirect',
    passReqToCallback: true,
    failureRedirect: '/login'
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({
        email: profile._json.emails[0].value
    }).then((user) => {
        if (user)
            return done(null, user.id);
        var newGUser = new User({
            email: profile._json.emails[0].value,
            gender: profile._json.gender,
            googleId: profile._json.id,
            name: profile._json.name.givenName,
            lastName: profile._json.name.familyName,
            gImage: profile._json.image.url
        });
        newGUser.save().then((savedGUser) => {
            if (savedGUser)
                return done(null, savedGUser.id);
            return done(null, null, req.flash('danger', 'Something went wrong, Cant save user'));
        }).catch((e) => {
            req.flash('danger', 'Something went wrong.. code: gOauthSaveCatch');
            console.log("loging error : \n", e);
        });
    }).catch((e) => {
        req.flash('danger', 'Something went wrong.. code: gOauthFindCatch');
        console.log("loging error : \n", e);
    });;
}));

// https://da-friendsbook.herokuapp.com/google/redirect