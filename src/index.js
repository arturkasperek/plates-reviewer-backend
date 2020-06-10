require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const { get } = require('lodash');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const Joi = require('@hapi/joi');
const AWS = require('aws-sdk');
const validator = require('express-joi-validation').createValidator({});

const ID = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REGION;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27',
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: REGION,
});


//TODO refactor
if ( !process.env.AWS_ACCESS_KEY ) {
  throw new Error('Please specify env file !!');
}

const { addReport, removeReport, getReports, initDB } = require('./db');

const app = express();
const port = 8080;
const S3Upload = require('./services/S3Upload');

app.use(bodyParser.json());

app.post('/upload-car-image', S3Upload.single('image'), async (req, res) => {
  const detectionResult = await rekognition.detectText({
    Image: {
      S3Object: {
        Bucket: req.file.bucket,
        Name: req.file.key,
      }
    }
  }).promise();
  const platesProposal = get(detectionResult, 'TextDetections', []).find(i => {
    return i.DetectedText.length > 3;
  });

  res.json({
    url: req.file.location,
    platesProposal: get(platesProposal, 'DetectedText'),
  });
});

app.post('/report', validator.body(
  Joi.object({
    lat: Joi.number().min(-180).max(180).required(),
    long: Joi.number().min(-180).max(180).required(),
    comment: Joi.string(),
    mediaURL: Joi.string().uri().required(),
    platesNumber: Joi.string().required(),
  })
), async (req, res) => {
  const report = await addReport(req.body);

  res.json(report);
});

app.get('/report', validator.query(
  Joi.object({
    skip: Joi.number(),
    limit: Joi.number(),
    search: Joi.string(),
  })
), async (req, res) => {
  const skip = get(req.query, 'skip', 0);
  const limit = get(req.query, 'limit', 9999);
  const search = get(req.query, 'search', '');
  const reports = await getReports(skip, limit, search);

  res.json({
    total: reports.total,
    result: reports.result,
  });
});

app.delete('/report',
  basicAuth({
    users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
  }),
  validator.body(
    Joi.object({
      id: Joi.string().required(),
    })
  ), async (req, res) => {
  try {
    const deletedId = await removeReport(req.body.id);

    res.json({
      id: deletedId,
    });
  } catch (e) {
    if ( e.resCode ) {
      res.status(e.resCode).send(e.message);
    } else {
      console.error(e);
      res.status(500).send('Backend error');
    }
  }
});

async function init() {
  await initDB();
  app.listen(port, () => console.log(`Plates reviewer API listening on port ${port}!`));
}

init();
