const express = require('express');

const app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('public'));

/* app.get('/', (req, res) => {
    res.render('index.html');
}); */


app.listen(port, () => {
    console.log(`App is runing in port : ${port}`);
});