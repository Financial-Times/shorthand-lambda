/**
 * Main pipeline for Shorthand Lambda scripts
 */

'use strict';

const extname = require('path').extname;
const S3 = require('aws-sdk').S3;
const cheerio = require('cheerio');
const comments = require('./comments');
const imageservice = require('./imageservice');
const oTracking = require('./o-tracking');
const utils = require('./utils');

const resultBase = `http://${process.env.DEST_BUCKET}.s3-website-` +
  `${process.env.DEST_BUCKET_REGION}.amazonaws.com/`;

/**
 * Pipeline for modifying HTML documents
 * @param  {string} body Unprocessed DOM as string
 * @param  {object} item Item from Lambda S3 event
 * @return {void}        Calls Lambda callback; returns void.
 */
function pipeline(body, item, cb) {
  if (!body) return cb('Empty HTML document');
  const withImageService = imageservice(body, item.s3.object.key); // Needs to be before creating Cheerio object.

  const $ = cheerio.load(withImageService);
  const args = utils.getArgs($);

  if (args.uuid) { // Editorial project
    const withComments = comments($, args);
    const withTracking = oTracking(withComments, args);
    // rest of editorial pipeline...
    utils.deploy(item, withTracking.html())
      .then(key => {
        cb(null, `Deployed to: ${resultBase}${key}`);
      })
      .catch(cb);
  } else { // Commercial Content
    const withTracking = oTracking($);
    utils.deploy(item, withTracking.html())
      .then(key => {
        cb(null, `Deployed to: ${resultBase}${key}`);
      })
      .catch(cb);
  }
}

/**
 * This is the main Lambda function that does everything
 * @param  {object}   event   Lambda S3 event
 * @param  {object}   context Lambda context event
 * @param  {Function} cb      Lambda callback function
 * @return {void}
 */
module.exports.main = (event, context, cb) => {
  // Construct URL from event parts
  const item = event.Records.shift(); // Take first item in event; should only be one per event!
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;

  if (extname(key) === '.html') {
    const client = new S3({
      apiVersion: '2006-03-01',
      region: bucketRegion,
    });

    client.getObject({
      Bucket: bucketname,
      Key: key
    }, (err, data) => {
      if (err) {
        console.error('** getObject error **');
        cb(err);
      } else {
        pipeline(data.Body.toString(), item, cb);
      }
    });
  } else {
    utils
      .deployAsset(key)
      .then(key => cb(null, `Deployed to: ${resultBase}${key}`))
      .catch(cb);
  }
};
