const express = require('express');

const app = express();
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');
const IamTokenManagerV1 = require('watson-developer-cloud/iam-token-manager/v1');

// Create the token manager
let tokenManager;
let instanceType;
const serviceUrl = process.env.SPEECH_TO_TEXT_URL || 'https://stream.watsonplatform.net/speech-to-text/api';

if (process.env.SPEECH_TO_TEXT_IAM_APIKEY && process.env.SPEECH_TO_TEXT_IAM_APIKEY !== '') {
  instanceType = 'iam';
  tokenManager = new IamTokenManagerV1.IamTokenManagerV1({
    iamApikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY || '<iam_apikey>',
    iamUrl: process.env.SPEECH_TO_TEXT_IAM_URL || 'https://iam.bluemix.net/identity/token',
  });
} else {
  instanceType = 'cf';
  const speechService = new SpeechToTextV1({
    username: process.env.SPEECH_TO_TEXT_USERNAME || '<username>',
    password: process.env.SPEECH_TO_TEXT_PASSWORD || '<password>',
    url: serviceUrl,
  });
  tokenManager = new AuthorizationV1(speechService.getCredentials());
}

// app.get('/', (req, res) => res.render('index'));

// // Get credentials using your credentials
// app.get('/api/credentials', (req, res, next) => {
//   tokenManager.getToken((err, token) => {
//     if (err) {
//       next(err);
//     } else {
//       let credentials;
//       if (instanceType === 'iam') {
//         credentials = {
//           accessToken: token,
//           serviceUrl,
//         };
//       } else {
//         credentials = {
//           token,
//           serviceUrl,
//         };
//       }
//       res.json(credentials);
//     }
//   });
// });

module.exports = app;
