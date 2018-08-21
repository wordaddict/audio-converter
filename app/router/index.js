require('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const unirest = require('unirest');
const router = express.Router();
const time = Date.now();
const fs = require('fs');
const config = require('../config/config');

const apiUrl = config.apiUrl;
const apiAuth = config.apiAuth;

const newFileName = `audio${time}.flac`;
const url = apiUrl;
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, newFileName);
    }
  })

const upload = multer({ storage }).single('file');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

router.post('/audio', (req, res, next) => {
    upload(req, res, (err) => {
        console.log('files', req.files)
        console.log('file body', req.body)
        console.log('file', req.file)
        if (err) {
              res.json({ error_code: 1, err_desc: err })
            return;
        }
        if (!req.file) {
              res.json({ error_code: 2, err_desc: err })
            return;
        }

        unirest.post(url)
        .headers({ 'Content-Type': 'audio/flac' })
        .headers({ 'Authorization': apiAuth })
        .field('filename', newFileName)
        .attach('file', req.file.path) // Attachment
        .end(function(response) {
            let ans = response.raw_body;
            if(!ans) {
                return;
            }
           ans = JSON.parse(ans);
           const data = ans.results[0].alternatives[0].transcript;
          fs.unlinkSync(req.file.path);//remove the file
          res.send({
              code: 200,
              error: false,
              message: 'audio converted successfully',
              response: data
          })
         });
    });
})

module.exports = router;