const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const router = express.Router();
// const time = Date.now();

// const newFileName = `audio${time}.mp3`;
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         console.log('req from destination', req);
//         console.log('file from destination', file);
//       cb(null, __dirname);
//     },
//     filename: function (req, file, cb) {
//         console.log('req from filename', req);
//         console.log('file from filename', file);
//       cb(null, newFileName);
//     }
//   })
var upload = multer({ dest: 'uploads/' })

router.use(bodyParser.json());
//router.use(bodyParser.json({limit: '50mb', extended: true}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

router.get('/test', (req, res) => {
    res.send('This also worked!');
});

router.post('/audio', upload.single('avatar'), (req, res, next) => {
    console.log('req file', req.file);
    res.send('we move');
    next();
})

//SELECT abill.*, asub.* FROM "vas_airtel_terravas_billing" AS abill JOIN "vas_airtel_terravas_subscription" AS asub ON abill.msisdn = asub.msisdn limit 10;

//SELECT COUNT(*) AS value FROM "vas_airtel_terravas_billing" AS abill JOIN "vas_airtel_terravas_subscription" AS asub ON abill.msisdn = asub.msisdn;

module.exports = router;