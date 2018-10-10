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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});