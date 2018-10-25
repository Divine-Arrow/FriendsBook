const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');

const routes = require('./server/routes');
const passportSetup = require('./server/passport/passport');

const app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', routes);

app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});