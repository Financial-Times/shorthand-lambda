/**
 * Main pipeline for Shorthand Lambda scripts
 */

const extname = require('path').extname;
const axios = require('axios');
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
  const endpoint = `http://${bucketname}.s3-website-${bucketRegion}.amazonaws.com/${key}`;

  if (extname(key) === '.html') axios.get(endpoint).then(pipeline).catch(console.error);
  else utils.deployAsset(key).then(url => cb(null, `Deployed asset to ${url}`)).catch(console.error);
};
