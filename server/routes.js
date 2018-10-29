const Router = require('express').Router();
const passport = require('passport');
const db = require('./database/db');

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
Router.post('/register', passport.authenticate('local-signup', {
    failureRedirect: '/register'
}), (req, res) => {
    req.logout();
    res.redirect('/login');
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
Router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

// google
Router.get('/oauth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
// google redirect
Router.get('/oauth/google/redirect', passport.authenticate('google', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

Router.get('/find', authCheck, (req, res) => {
    res.render('find');
});

// create password
Router.get('/createPass/:id', (req, res) => {
    res.render('createPass', {
        flash: {
            success: req.flash('success'),
            danger: req.flash('danger'),
        },
        userID: req.params.id
    });
});

// createPassPost
Router.post('/createPass/:id', (req, res) => {
    if(req.body.password !== req.body.confirmPassword) {
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

Router.get('/chat', authCheck, (req, res) => {
    res.render('chat');
});

Router.get('/thanks', authCheck, (req, res) => {
    res.render('thanks');
});

Router.get('/logout', authCheck, (req, res) => {
    req.logOut();
    req.flash('success', 'Loged out');
    res.redirect('/login');
});

Router.get('*', (req, res) => {
    res.render('notFound');
});

module.exports = Router;