const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const router = express.Router();
const time = Date.now();

const newFileName = `audio${time}.mp3`;
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, newFileName);
    }
  })

const upload = multer({ storage }).single('audio');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

router.post('/audio', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
              res.json({ error_code: 1, err_desc: err })
            return;
        }
        if (!req.file) {
              res.json({ error_code: 2, err_desc: err })
            return;
        }
    console.log('File uploaded', req.file);
    res.send('we are live')
    });
})

module.exports = router;