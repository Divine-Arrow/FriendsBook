const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const User = require('../models/user');
const keys = require('../config/keys/keys');
const _ = require("lodash");

passport.serializeUser((userId, done) => {
    if (!userId)
        return done('error reload again.');
    return done(null, userId);
});

passport.deserializeUser((id, done) => {
    if (!id)
        return done('please reload again.');
    User.findById(id).then((user) => {
        done(null, user)
    }).catch((e) => {
        if (e) done('err');
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

                newUser.generateHash(bodyData.password, (err, hash) => {
                    if (err || !hash)
                        return done(null, undefined, req.flash('danger', 'Password hashing error..!'));
                    newUser.password = hash;
                    newUser.save().then((user) => {
                        if (user)
                            return done(null, user.id, req.flash('success', `Verify <strong>${user.email}</strong>`));
                    }).catch((e) => {
                        if (e.code === 11000) {
                            return done(null, undefined, req.flash('danger', 'Email Already exist.'));
                        }
                        return done(null, undefined, req.flash('danger', 'Somthing went wrong.'));
                    });
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
        if (!user.isVerified)
            return done(null, undefined, req.flash('danger', 'Login with <strong>Google</strong> or <strong>facebook</strong>. else \n<a href="/forgot" style="color: inherit "><strong>forgot</strong></a> password'));
        user.validHash(password, (err, result) => {
            if (err) {
                if (err === 404) {
                    // pass data to routes.js
                    return done(null, null, req.flash('danger', `<a href="/forgot" style="color: inherit "><strong>forgot</strong></a> password or use Oauth.`));
                }
                return done(null, undefined, req.flash('danger', err));
            }
            if (result)
                return done(null, user.id);
            return done(null, null, req.flash('danger', 'wrong passwrod.. Try again.'));
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
        if (!user) {
            var userData = {
                email: profile._json.emails[0].value,
                gender: profile._json.gender,
                googleId: profile._json.id,
                name: profile._json.name.givenName,
                lastName: profile._json.name.familyName,
                gImage: profile._json.image.url
            }
            var newGUser = new User(userData);
            newGUser.save().then((savedGUser) => {
                if (savedGUser)
                    return done(null, savedGUser.id);
                return done(null, null, req.flash('danger', 'Something went wrong, Cant save user'));
            }).catch((e) => {
                req.flash('danger', 'Something went wrong.. code: gOauthSaveCatch');
            });
        } else if (user) {
            if (!user.googleId) {
                var updateData = {
                    gender: profile._json.gender,
                    googleId: profile._json.id,
                    gImage: profile._json.image.url
                }
                User.findByIdAndUpdate(user.id, {
                    $set: updateData
                }, {
                    new: true
                }).then((updatedUser) => {
                    if (!updatedUser)
                        return req.flash('danger', 'cant update user');
                }).catch((e) => {
                    if (e)
                        return req.flash('danger', 'Something went wrong.. catch-code: gUpdateSaveCatch');
                })
            }
            return done(null, user.id);
        }
    }).catch((e) => {
        req.flash('danger', 'Something went wrong.. code: gOauthFindCatch');
    });
}));

// facebook
passport.use(new FacebookStrategy({
    clientID: keys.fb.clientID,
    clientSecret: keys.fb.clientSecret,
    passReqToCallback: true,
    callbackURL: '/oauth/facebook/redirect',
    failureRedirect: '/login',
    profileFields: ['hometown', 'location', 'picture.height(480)', 'name', 'displayName', 'birthday', 'gender', 'email', 'age_range'],
}, (req, accessToken, refreshToken, profile, done) => {
    if (!profile || !profile._json.email)
        return done('cant find profile', req.flash('danger', 'cant find profile on fb.'));
    User.findOne({
        email: profile._json.email
    }).then((user) => {
        if (!user) {
            userData = {
                email: profile._json.email,
                name: profile._json.first_name,
                lastName: profile._json.last_name,
                birthday: profile._json.birthday,
                fImage: profile._json.picture.data.url,
                gender: profile._json.gender,
                facebookId: profile._json.id,
                /* hometown: profile._json.hometown.name,
                    location: profile._json.location.name */
            };
            var newFUser = new User(userData);
            newFUser.save().then((savedFUser) => {
                if (savedFUser)
                    return done(null, savedFUser.id);
                return done(null, null, req.flash('danger', 'Something went wrong, Cant create user'));
            }).catch((e) => {
                if (e)
                    return req.flash('danger', 'Something went wrong.. code: fOauthSaveCatch');
            });
        } else if (user) {
            if (!user.facebookId) {
                var updateData = {
                    name: profile._json.first_name,
                    lastName: profile._json.last_name,
                    birthday: profile._json.birthday,
                    fImage: profile._json.picture.data.url,
                    gender: profile._json.gender,
                    facebookId: profile._json.id,
                    /* hometown: profile._json.hometown.name,
                    location: profile._json.location.name */
                }
                User.findByIdAndUpdate(user.id, {
                    $set: updateData
                }, {
                    new: true
                }).then((updatedUser) => {
                    if (!updatedUser)
                        return req.flash('danger', 'cant update user');
                }).catch((e) => {
                    if (e)
                        return req.flash('danger', 'Something went wrong.. catch-code: fUpdateSaveCatch');
                })
            }
            return done(null, user.id);

        }
    }).catch((e) => {
        req.flash('danger', 'Something went wrong.. code: gOauthFindCatch');
    });
}));

// https://da-friendsbook.herokuapp.com/google/redirect