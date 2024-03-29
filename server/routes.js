const Router = require('express').Router();
const passport = require('passport');
const db = require('./database/db');
const mailer = require('./config/mailer');

const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('danger', 'please login or register.');
        return res.redirect('/login');
    }
    next();
}

const revAuthCheck = (req, res, next) => {
    if (!req.isAuthenticated())
        return next();
    return res.redirect('/chat');
}

// routes
Router.get('/', (req, res) => {
    res.render('index', {
        homepage: true
    });
});

// Resiter
Router.get('/register', revAuthCheck, (req, res) => {
    res.render('register', {
        flash: {
            danger: req.flash('danger')
        }
    });
});

// Register POST
Router.post('/register', revAuthCheck, passport.authenticate('local-signup', {
    failureRedirect: '/register'
}), (req, res) => {
    // req.logout();
    req.logout((err) => {
        if (err) { res.redirect('/login'); }
        // res.redirect('/login');
        db.findit(req.body.email, (err, email) => {
            if (err) {
                req.flash('danger', 'Something went Wrong');
                return res.redirect('/forgot');
            };
            if (!email) {
                req.flash('danger', 'Email is not registed');
                return res.redirect('/forgot')
            }
            db.createLink(email, (err, hash) => {
                if (err || !hash) {
                    req.flash('danger', err);
                    return res.redirect('/forgot');
                }
                const link = `${req.protocol}://${req.get('host')}/verify/new/${hash}`;
                mailer.send(email, link, (err, result) => {
                    if (err) {
                        req.flash('success', `<a href="${link}">Verify here</a>`);
                        req.flash('danger', `Cant sent verification mail.`);
                        return res.redirect('/forgot');
                    }
                    if (!result) {
                        req.flash('danger', 'something went wrong.');
                        return res.redirect('/login');
                    }
                    return res.redirect('/login');
                });
            });
        });
    });
});

Router.get('/login', revAuthCheck, (req, res) => {
    res.render('login', {
        flash: {
            success: req.flash('success'),
            danger: req.flash('danger')
        }
    });
});

// local-login-post
Router.post('/login', revAuthCheck, passport.authenticate('local-login', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

// google
Router.get('/oauth/google', revAuthCheck, passport.authenticate('google', {
    scope: ['profile', 'email']
}));
// google redirect
Router.get('/oauth/google/redirect', revAuthCheck, passport.authenticate('google', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

// facebook
Router.get('/oauth/facebook', passport.authenticate('facebook', {
    // the scope is porvided on the passport-setup.js
    scope: ['email', 'user_gender', 'user_birthday', 'user_location', 'user_hometown', 'user_age_range']
}));

// facebook redirect
Router.get('/oauth/facebook/redirect', passport.authenticate('facebook', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

Router.get('/find', authCheck, (req, res) => {
    res.render('find');
});

// Forgot password
Router.get('/forgot', revAuthCheck, (req, res) => {
    res.render('forgot', {
        flash: {
            success: req.flash('success'),
            danger: req.flash('danger'),
        }
    });
});

// Forgot POST password
Router.post('/forgot', revAuthCheck, (req, res) => {
    db.findit(req.body.email, (err, email) => {
        if (err) {
            req.flash('danger', 'Something went Wrong');
            return res.redirect('/forgot');
        };
        if (!email) {
            req.flash('danger', 'Email is not registed');
            return res.redirect('/forgot')
        }
        db.createLink(email, (err, hash) => {
            if (err || !hash) {
                req.flash('danger', err);
                return res.redirect('/forgot');
            }
            const link = `${req.protocol}://${req.get('host')}/verify/forgot/${hash}`;
            mailer.send(email, link, (err, result) => {
                if (err) {
                    req.flash('danger', 'Cant sent verification mail.');
                    return res.redirect('/forgot');
                }
                if (!result) {
                    req.flash('danger', 'something went wrong.');
                    return res.redirect('/login');
                }
                req.flash('success', `Verification sent to <strong>${email}</strong>`);
                return res.redirect('/login');
            });
        });
    });
});

// verify
Router.get('/verify/:way/:token', revAuthCheck, (req, res) => {
    db.verifyToken(req.params.token, (err, isVerified, userId) => {
        if (err || !isVerified) {
            req.flash('danger', err);
            return res.redirect('/forgot');
        }
        if (req.params.way === "new") {
            req.flash('success', 'Account Verified ! Try Loging in');
            return res.redirect('/login');
        } else if (req.params.way === "forgot") {
            req.flash('success', 'Enter your password');
            res.redirect(`/createPass/${userId}`);
        }
    });
});

// create password
Router.get('/createPass/:id', revAuthCheck, (req, res) => {
    res.render('createPass', {
        flash: {
            success: req.flash('success'),
            danger: req.flash('danger'),
        },
        userID: req.params.id
    });
});

// createPassPost
Router.post('/createPass/:id', revAuthCheck, (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('danger', 'password must match, try again.');
        return res.redirect('/login');
    }
    db.createPass(req.params.id, req.body.password, (err, response) => {
        if (err)
            req.flash('danger', 'cant set the password');
        if (!response)
            req.flash('danger', 'Something went wrong.')
        req.flash('success', 'Password updated.')
        return res.redirect('/login')
    });
});

/* Router.get('/chat', authCheck, (req, res) => {
    res.render('chat');
}); */
Router.get('/chat', (req, res) => {
    res.render('chat');
});

Router.get('/thanks', authCheck, (req, res) => {
    res.render('thanks');
});

Router.get('/logout', authCheck, (req, res) => {

    req.logout((err) => {
        if (err) { res.redirect('/login');; }
        res.redirect('/login');
    });

    // req.logOut();
    // req.flash('success', 'Loged out');
    // res.redirect('/login');
});

Router.get('/pirvacy-policy', (req, res) => {
    res.render('privacyPolicy');
});

Router.get('*', (req, res) => {
    res.render('notFound');
});

module.exports = Router;