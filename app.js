const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const config = require('./config');

// Init app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/preview/delete', (req, res) => {
  fs.unlink(`public/uploads/${req.query.filename}`, function(err) {
    res.json({success: !!err});
  });
});

// Init Upload
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
}).single('image');

app.post('/preview/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err){
      res.json({
        success: false
      });
    } else {
      if (req.file) {
        res.json({
          success: true,
          filename: req.file.filename
        });
      }
    }
  });
});

app.post('/upload', (req, res) => {
  let filenames = req.body.filename;
  if (typeof filenames == 'string') {
    filenames = [filenames];
  }

  const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  };

  const imagesDir = config.imagesDir;
  const today = moment().format('YYYY-MM-DD');
  const todayDirName = path.join(imagesDir, `/${today}`);
  mkdirsSync(todayDirName);
  let seq = fs.readdirSync(todayDirName).length + 1;
  mkdirsSync(`${todayDirName}/${seq}`);
  filenames.forEach((filename, index) => {
    fs.rename(
      `public/uploads/${filename}`,
      `${todayDirName}/${seq}/${filename}`,
      (e) => {
        if (e) {
          console.log(e);
        }
      });
  });
  res.json({success: true});
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));