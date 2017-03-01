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
  const item = event.Records.shift(); // Take first item in event; should only be one per event!

  function pipeline(body) {
    if (!body) return cb('Empty HTML document');
    const withImageService = imageservice(body); // Needs to be before creating Cheerio object.
    const $ = cheerio.load(withImageService);
    const uuid = utils.getUUID($);

    if (uuid) { // Editorial project
      console.log('editorial project!');
      const withComments = comments($);

      // rest of editorial pipeline...
      utils.deploy(item, withComments.html())
        .then(url => {
          cb(null, `Deployed to ${url}`);
        })
        .catch(console.error);
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
        pipeline(data);
      }
    });
  } else {
    utils.deployAsset(key).then(url => cb(null, `Deployed asset to ${url}`)).catch(console.error);
  }
};
