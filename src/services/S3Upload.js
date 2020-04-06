const AWS = require('aws-sdk');
const fs = require('fs');
const multerS3 = require('multer-s3');
const multer = require('multer');
const uuid = require('uuid');

const ID = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;


const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, `car-images/${uuid.v4()}-${file.originalname}`);
    }
  })
});

module.exports = uploadS3;
