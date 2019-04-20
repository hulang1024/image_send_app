const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

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

  const today = moment().format('YYYY-MM-DD');
  let seq = 1;
  if (!fs.existsSync(`images/${today}`)) {
    fs.mkdirSync(`images/${today}`);
  } else {
    seq = fs.readdirSync(`images/${today}`).length + 1;
  }

  if (!fs.existsSync(`images/${today}/${seq}`)) {
    fs.mkdirSync(`images/${today}/${seq}`);
  }
  filenames.forEach((filename, index) => {
    fs.rename(`public/uploads/${filename}`, `images/${today}/${seq}/${filename}`, () => {});
  });
  res.json({success: true});
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));