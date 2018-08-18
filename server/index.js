const express = require('express');
const app = express();
const router = require('./router/index');

app.use('/', router);

app.get('/', (req, res) => {
    res.send('Welcome to the audio api');
});

const port = 3005;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});