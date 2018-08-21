const express = require('express');
const app = express();
const router = require('./router/index');
const path = require('path');
const pug = require('pug');

app.use('/', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

const port = 3005;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});