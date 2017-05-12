/**
 * Replaces relative CSS/JS paths with vanity url compatible paths on the ft.com domain
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
  const relativeRegex = /\.(\/.*?\.(?:css|js))/g; // For relative paths
  const replacer = `https://www.ft.com${filePath}$1`;
  // Assuming data contains the HTML body...
  return body
    .replace(relativeRegex, replacer);
};
