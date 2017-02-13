/**
 * Utils library for shorthand-lambda
 */

const cheerio = require('cheerio');

module.exports.getUUID = html => {
  const $ = cheerio.load(html);
  return $('[name="news_keywords"]').attr('content').match(/UUID:([\w-]+)/).pop();
};
