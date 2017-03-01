/**
 * Utils library for shorthand-lambda
 */

const S3 = require('aws-sdk').S3;

const client = new S3();

/**
 * Return UUID from news_keywords meta tag
 * @param  {Cheerio} $ Parsed Cheerio DOM
 * @return {string}   UUID string
 */
module.exports.getUUID = $ =>
  $('[name="news_keywords"]').attr('content').match(/UUID:([\w-]+)/).pop();

/**
 * Deploy resulting file to final path
 * @return {url} URL to deployed file
 */
module.exports.deploy = (Body, item) => new Promise((resolve, reject) => {
  client.putObject({
    Bucket: process.env.DEST_BUCKET,
    Key: item.s3.object.key,
    Body,
  }, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/**
 * Deploy asset from source S3 bucket to destination S3 bucket
 * @param {string} key Object key
 */
module.exports.deployAsset = Key => new Promise((resolve, reject) => {
  client.copyObject({
    Bucket: process.env.DEST_BUCKET,
    Key,
    CopySource: encodeURIComponent(`${process.env.SOURCE_BUCKET}/${Key}`)
  }, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});
