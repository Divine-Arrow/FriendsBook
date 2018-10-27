const Router = require('express').Router();
const passport = require('passport');

// routes
Router.get('/', (req, res) => {
    res.render('index', {
        homepage: true
    });
});

// Resiter
Router.get('/register', (req, res) => {
    res.render('register', {
        flash: {
            danger: req.flash('danger')
        }
    });
});

Router.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register'
}));

Router.get('/login', (req, res) => {
    // req.flash('danger', 'something went wrong');
    res.render('login', {
        flash: {
            success: req.flash('success'),
            danger: req.flash('danger')
        }
    });
});

Router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/chat',
    failureRedirect: '/login'
}));

Router.get('/find', (req, res) => {
    res.render('find');
});

Router.get('/chat', (req, res) => {
    res.render('chat');
});

Router.get('/thanks', (req, res) => {
    res.render('thanks');
});

Router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

Router.get('*', (req, res) => {
    res.render('notFound');
});

module.exports = Router;