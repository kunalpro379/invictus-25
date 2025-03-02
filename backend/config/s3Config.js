const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: 'AKIAYS2NUNY5A4QW2JVS',
    secretAccessKey: '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'
  }
});

const bucketName = 'research-papers-invictus';

module.exports = { s3Client, bucketName };
