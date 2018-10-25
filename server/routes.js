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
    res.render('register');
});

Router.post('/register', passport.authenticate('local-signup'));

Router.get('/login', (req, res) => {
    res.render('login');
});

Router.get('/find', (req, res) => {
    res.render('find');
});

Router.get('/chat', (req, res) => {
    res.render('chat');
});

Router.get('/thanks', (req, res) => {
    res.render('thanks');
});

Router.get('*', (req,res) =>{
    res.render('notFound');
});

module.exports = Router;