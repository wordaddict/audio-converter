require('dotenv').config();

const express = require('express');
const multer = require('multer');
const unirest = require('unirest');
const router = express.Router();
const time = Date.now();
const fs = require('fs');
const config = require('../config/config');
const path = require('path');
const recognizeFile = require('watson-speech/speech-to-text/recognize-file');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');
const IamTokenManagerV1 = require('watson-developer-cloud/iam-token-manager/v1');

// socket connection

var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');



const apiUrl = config.apiUrl;
const apiAuth = config.apiAuth;
var speech_to_text = new SpeechToTextV1({
    username: process.env.SPEECH_TO_TEXT_USERNAME,
    password: process.env.SPEECH_TO_TEXT_PASSWORD,
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
});
const tokenM = new AuthorizationV1(speech_to_text.getCredentials());
router.get('/token', (req, res) => {
  var speech_to_text = new SpeechToTextV1({
    username: process.env.SPEECH_TO_TEXT_USERNAME,
    password: process.env.SPEECH_TO_TEXT_PASSWORD,
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
  });
  const tokenM = new AuthorizationV1(speech_to_text.getCredentials());
  const token = tokenM.getToken((err, token) => {
    res.json(token);
  });

})
// const token = tokenM.getToken((err, token) => {
//   console.log('err', err);
//   console.log('token', token);
// })

// var params = {
//     token: speech_to_text,
//     objectMode: true,
//     'content_type': 'audio/mp3',
//     model: 'en-US_BroadbandModel',
//     'max_alternatives': 3
// };

// var params = {
//   token: token,
//   smart_formatting: true,
//   format: true,
//   model: 'en-US_BroadbandModel',
//   objectMode: true,
//   interim_results: true,
//   word_alternatives_threshold: 0.01,
//   timestamps: true,
// }

// Create the stream.


// socket


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
      const filePath = req.file.path;
      const fileName = filePath.split('/');
      const newFileN = fileName[1];
      const fileSize = req.file.size;
      const fileSizeInMb = fileSize / 1048576;


    // Test


      if (req.file === undefined){
        return res.send({
          error: true,
          code: 400,
          message: "unable to get file"
        })
      }

      // test
// Pipe in the audio.
      var speech_to_text = new SpeechToTextV1({
        username: process.env.SPEECH_TO_TEXT_USERNAME || 'f79ab83b-1938-4e8e-bd0f-fb14cad0a63a',
        password: process.env.SPEECH_TO_TEXT_PASSWORD || 'wuf2YOsBzyWv',
        url: 'https://stream.watsonplatform.net/speech-to-text/api',
      });
      const tokenM = new AuthorizationV1(speech_to_text.getCredentials());

      const token = tokenM.getToken((err, token) => {
        console.log('err', err);
        console.log('token', token);
        const params = {
          url: 'https://stream.watsonplatform.net/speech-to-text/api',
          file: __dirname + req.file.path,
          access_token: apiAuth,
          token: token,
          smart_formatting: true,
          format: true,
          model: 'en-US_BroadbandModel',
          objectMode: true,
          interim_results: true,
          word_alternatives_threshold: 0.01,
          timestamps: true,
        // outputElement: fs.createWriteStream(req.file.path).pipe(fs.writeFile('/uploads'))
        }
        var recognizeStream = recognizeFile(params);

        
        //fs.createReadStream(req.file.path).pipe(recognizeStream);
        // fs.createWriteStream().pipe(fs.writeFile('/uploads'))
        // outputElement
  
        // Listen for events.
        recognizeStream.on('data', function(event) { 
          onEvent('Data:', event); 
        });
        recognizeStream.on('data', function(data){
          console.log('datauuu', data);
        })
        
        recognizeStream.on('error', function(event) { onEvent('Error:', event); });
        
        recognizeStream.on('close', function(event) { onEvent('Close:', event); });
        return res.send('we are live');
        // Display events on the console.
        function onEvent(name, event) {
            console.log('name', name);
            //event = JSON.parse(event)
            console.log('event', event);
        };
      })

      

      // test
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
        // if (fileSizeInMb > 1) {
        //   return res.send({
        //     error: true,
        //     code: 400,
        //     message: "Unable to process large audio files"
        //   })
        // }
          // return unirest.post(url)
          // .headers({ 'Content-Type': `audio/${extention}` })
          // .headers({ 'Authorization': apiAuth })
          // .field('filename', newFileName)
          // .attach('file', req.file.path) // Attachment
          // .end(function(response) {
          //   const responseCode = response.statusCode;
          //   console.log('response', response.statusCode);
          //   if (responseCode === 400){
          //     return res.send({
          //       error: true,
          //       code: 400,
          //       message: 'file type not acceptable'
          //     })
          //   }
  
          //   if (responseCode === 404) {
          //     return res.send({
          //       error: true,
          //       code: 404,
          //       message: 'transcription not found'
          //     })
          //   }
  
          //     let ans = response.raw_body;
          //    ans = JSON.parse(ans);
          //    const data = ans.results[0].alternatives[0].transcript;
          //   fs.unlinkSync(req.file.path);//remove the file
          // res.render('audio', {text: data})
          //  });

    });

})

module.exports = router;

