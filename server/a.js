app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(routes);

var s3BucketID = config.config.s3.s3BucketId;
var s3Url = config.config.s3.s3UploadUrl;
var newFileName = `blacklist${time}.csv`;

var storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, __dirname);
    },
    filename: function (req, file, cb) {
      cb(null, newFileName);
    }
  })
   
var upload = multer({ storage: storage }).single('file');

app.get('/upload', (req, res) => {
    res.send('You are uploading this!')
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
       if (err) {
             res.json({ error_code: 1, err_desc: err })
           return;
       }
       if (!req.file) {
             res.json({ error_code: 2, err_desc: err })
           return;
       }       
       var mno = req.body.mno;

       unirest.post(s3Url)
       .headers({ 'Content-Type': 'multipart/form-data' })
       .field('appid', s3BucketID)
       .field('filename', newFileName)
       .attach('file', req.file.path) // Attachment
       .end(function(response) {
         const data = response;
         const uri = data.body.response.Location.toString();
         const jdata = { 'fileurl': uri, 'mno': req.body.mno };
         fs.unlinkSync(req.file.path);//remove the file   
         
         var publishData = new Promise(function(resolve, reject){
            rabbitQueue.publish(jdata, blacklist_rd); //push data to the Queue
            var isPublished = true;
            if (isPublished) {
                resolve();
            } else {
                reject();
            }
         })
         publishData.then(function(){
             res.status(200).send('FIle uploaded successfully')
         })
         .catch(function() {
             res.send({
                 "status": 400,
                 "message": "Unable to send file"
             })
         });
        });
    });
});