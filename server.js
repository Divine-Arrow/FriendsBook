const express = require('express');
const exphbs = require('express-handlebars');

const app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('public'));

// view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// routes
app.get('/', (req, res) => {
    res.render('index', {
        homepage: true
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});