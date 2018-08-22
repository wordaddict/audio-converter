require('dotenv').config();

const express = require('express');
const multer = require('multer');
const unirest = require('unirest');
const router = express.Router();
const time = Date.now();
const fs = require('fs');
const config = require('../config/config');
const path = require('path');

const apiUrl = config.apiUrl;
const apiAuth = config.apiAuth;

const newFileName = `audio${time}.flac`;
const url = apiUrl;
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, newFileName);
    }
  })

const upload = multer({ storage }).single('file');

router.post('/audio', (req, res, next) => {
    upload(req, res, (err) => {
      console.log('reqfile', req.file);
      if (req.file === undefined){
        return res.send({
          message: "unable to get file"
        })
      }
      const originalName = req.file.originalname;
      const videoExtention = originalName.split('.');
      const extention = videoExtention[1];
        if (err) {
              res.json({ error_code: 1, err_desc: err })
            return;
        }

        if (!req.file) {
              res.json({ error_code: 2, err_desc: err })
            return;
        }
        unirest.post(url)
        .headers({ 'Content-Type': `audio/${extention}` })
        .headers({ 'Authorization': apiAuth })
        .field('filename', newFileName)
        .attach('file', req.file.path) // Attachment
        .end(function(response) {
          const responseCode = response.statusCode;
          if (responseCode === 400){
            return res.send({
              error: true,
              code: 400,
              message: 'file type not acceptable'
            })
          }

          if (responseCode === 404) {
            return res.send({
              error: true,
              code: 404,
              message: 'transcription not found'
            })
          }

            let ans = response.raw_body;
           ans = JSON.parse(ans);
           const data = ans.results[0].alternatives[0].transcript;
          fs.unlinkSync(req.file.path);//remove the file
        res.render('audio', {text: data})
         });
    });
})

module.exports = router;