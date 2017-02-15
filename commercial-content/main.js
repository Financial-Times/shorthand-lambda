/**
 * Main pipeline for Shorthand Lambda scripts
 */

const { extname } = require('path');
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
      const url = utils.deploy(item, withComments.html());
      cb(null, `Deployed to ${url}`);
    } else { // Commercial Content
      // rest of commercial content pipeline...
      const url = utils.deploy(item, $.html());
      cb(null, `Deployed to ${url}`);
    }
  }

  // Construct URL from event parts
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;
  const endpoint = `http://${bucketname}.s3-website-${bucketRegion}.amazonaws.com/${key}`;

  if (extname(key) !== '.html') return cb();

  axios.get(endpoint).then(pipeline).catch(console.error);
};
