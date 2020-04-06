require('dotenv').config();
require('reflect-metadata');
const express = require('express');

//TODO refactor
if ( !process.env.AWS_ACCESS_KEY ) {
  throw new Error('Please specify env file !!');
}

const { addReport, getReports, initDB } = require('./db');

const app = express();
const port = 8080;
const S3Upload = require('./services/S3Upload');


app.post('/upload-car-image', S3Upload.single('image'), async (req, res) => {
  res.json({
    url: req.file.location,
  });
});

app.post('/report', async (req, res) => {
  const report = await addReport();

  res.json(report);
});

app.get('/report', async (req, res) => {
  const reports = await getReports();

  res.json({
    total: 999,
    result: reports,
  });
});

async function init() {
  await initDB();
  app.listen(port, () => console.log(`Plates reviewer API listening on port ${port}!`));
}

init();
