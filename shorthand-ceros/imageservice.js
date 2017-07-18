/**
 * Adds Image Service URLs to content using yucky regex replacement
 * @param {string} body     Body as a string
 * @returns {string|void}   modified HTML body string or void
 *
 * @TODO URLencode the matching URLs
 * @TODO maybe use Cheerio for this instead?
 */
module.exports = (body, filePath) => {
  if (!body || typeof body !== 'string') return;
  if (typeof filePath === 'string') {
    filePath = '/' + filePath.substring(0, filePath.lastIndexOf('/'));
  } else {
    filePath = '';
  }
  const relativeRegex = /((\.|media*)\/.*?\.(?:jpe?g|png|svg|gif))/g; // For relative paths
  const absoluteAwsRegex = /(.*?amazonaws\.com\/.*?\.(?:jpe?g|png|svg|gif))/g; // For absolute paths on AWS
  const endpointURI = encodeURIComponent(`https://s3-${process.env.DEST_BUCKET_REGION}.amazonaws.com/${process.env.DEST_BUCKET}${filePath}`);
  const replaceAbsolute = `https://www.ft.com/__origami/service/image/v2/images/raw$1?source=commercial-content-lambda`;

  function replaceRel(match, p1) {
    if (p1.charAt(0) === '.') {
      p1 = p1.substr(1);
    }
    p1 = encodeURIComponent(p1);
    return `https://www.ft.com/__origami/service/image/v2/images/raw/${endpointURI}${p1}?source=commercial-content-lambda`;
  }

  // Assuming data contains the HTML body...
  return body
    .replace(relativeRegex, replaceRel) // Pass 1: change relative URLs to image service
    .replace(absoluteAwsRegex, replaceAbsolute) // Pass 2: change absolute AWS paths to image service
    ;
};
