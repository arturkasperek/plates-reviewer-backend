require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080;
const S3Upload = require('./services/S3Upload');

if ( !process.env.AWS_ACCESS_KEY ) {
  throw new Error('Please specify env file !!');
}

app.post('/upload-car-image', S3Upload.single('image'), async (req, res) => {
  res.json({
    url: req.file.location,
  });
});

app.post('/add-report', async (req, res) => {

});

async function init() {

  app.listen(port, () => console.log(`Plates reviewer API listening on port ${port}!`));
}

init();
