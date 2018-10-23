const express = require('express');
const exphbs = require('express-handlebars');

const routes = require('./server/routes');

const app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('public'));

// view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// routes
app.use('/', routes);


app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});