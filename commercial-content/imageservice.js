const cheerio = require('cheerio');
const axios = require('axios');

module.exports.addUrls = (event, context) => {
  const item = event.Records.shift(); // Take first item in event; should only be one per event!

  // Construct URL from event parts
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;
  const endpoint = `http://${bucketname}.s3-website-${bucketRegion}.amazonaws.com/${key}`;
  const relativeRegex = /\.(\/.*?\.(?:jpe?g|png|svg|gif))/g; // For relative paths
  const absoluteAwsRegex = /.*?amazonaws\.com(\/.*?\.(?:jpe?g|png|svg|gif))/g; // For absolute paths on AWS
  const replaceRelative = `https://www.ft.com/__origami/service/image/v2/images/raw$1?source=commercial-content-lambda`;
  const replaceAbsolute = `https://www.ft.com/__origami/service/image/v2/images/raw$1?source=commercial-content-lambda`;

  axios.get(endpoint)
    .then(body => {
      // Assuming data contains the HTML body...

      // Pass 1: change relative URLs to image service
      const pass1 = body.replace(relativeRegex, replaceRelative);

      // Pass 2: change absolute AWS paths to image service
      // const pass2 = pass1.replace(absoluteAwsRegex, replaceAbsolute);

      context.success(pass1);
    })
    .catch(console.error);
};
