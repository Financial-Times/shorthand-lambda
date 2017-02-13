
const cheerio = require('cheerio');
const axios = require('axios');

module.exports.getUUID = html => {
  const $ = cheerio.load(html);
  return $('[name="news_keywords"]').attr('content').match(/UUID:([\w-]+)/).shift();
};
