const Router = require('express').Router();


// routes
Router.get('/', (req, res) => {
    res.render('index', {
        homepage: true
    });
});

Router.get('/register', (req, res) => {
    res.render('register');
});

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