/**
 * Main pipeline for Shorthand Lambda scripts
 */

const extname = require('path').extname;
const S3 = require('aws-sdk').S3;
const cheerio = require('cheerio');
const comments = require('./comments');
const imageservice = require('./imageservice');
const utils = require('./utils');

module.exports.main = (event, context, cb) => {
  function pipeline(body, item) {
    console.dir(item);
    if (!body) return cb('Empty HTML document');
    const withImageService = imageservice(body); // Needs to be before creating Cheerio object.
    const $ = cheerio.load(withImageService);
    const uuid = utils.getUUID($);

    if (uuid) { // Editorial project
      console.log('editorial project!');
      const withComments = comments($);

      // rest of editorial pipeline...
      console.log('out of comment');
      utils.deploy(item, withComments.html())
        .then(url => {
          cb(null, `Deployed to ${url}`);
        })
        .catch(err => {
          console.error('in deploy catch');
          console.error(err);
          cb(err);
        });
    } else { // Commercial Content
      // rest of commercial content pipeline...
      utils.deploy(item, $.html())
        .then(url => {
          cb(null, `Deployed to ${url}`);
        })
        .catch(console.error);
    }
  }

  // Construct URL from event parts
  const item = event.Records.shift(); // Take first item in event; should only be one per event!
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;

  if (extname(key) === '.html') {
    console.log('getting HTML file');
    const client = new S3({
      apiVersion: '2006-03-01',
      region: bucketRegion,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    });

    client.getObject({
      Bucket: bucketname,
      Key: key
    }, (err, data) => {
      if (err) {
        console.log('getObject error');
        cb(err);
      } else {
        console.log('into pipeline');
        pipeline(data.Body.toString(), item);
      }
    });
  } else {
    utils.deployAsset(key).then(url => cb(null, `Deployed asset to ${url}`)).catch(console.error);
  }
};
