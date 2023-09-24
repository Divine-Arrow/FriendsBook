const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require('express-session');

const routes = require('./server/routes');
const keys = require('./server/config/keys/keys');
const passportSetup = require('./server/passport/passport');

const app = express(),
    port = process.env.PORT || 3000;

mongoose.connect(keys.mongo.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(
    (res) => console.log("DB is ready"),
    (err) => console.log("DB ERROR CONNECTING",err)
);

mongoose.set('useCreateIndex', true);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// for https
app.enable('trust proxy');

// view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'secretString',
    resave: false,
    saveUninitialized: true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// https force
/* app.get('*', function (req, res, next) {
    if (req.headers['x-forwarded-proto'] != 'https')
        res.redirect('https://mypreferreddomain.com' + req.url)
    else
        next();
}) */
// routes
app.use('/', routes);

app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});