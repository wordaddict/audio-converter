const express = require('express');
const app = express();
const router = require('./router/index');
const path = require('path');
const pug = require('pug');

const port = process.env.PORT || 3005;

module.exports = function(environments, status) {
    environments = environments || ['production'];
    status = status || 302;
    return function(req, res, next) {
      if (environments.indexOf(process.env.NODE_ENV) >= 0) {
        if (req.headers['x-forwarded-proto'] != 'https') {
          res.redirect(status, 'https://' + req.hostname + req.originalUrl);
        }
        else {
          next();
        }
      }
      else {
        next();
      }
    };
  };

app.use('/', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});