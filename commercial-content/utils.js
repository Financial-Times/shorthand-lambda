/**
 * Utils library for shorthand-lambda
 */

/**
 * Return UUID from news_keywords meta tag
 * @param  {Cheerio} $ Parsed Cheerio DOM
 * @return {string}   UUID string
 */
module.exports.getUUID = $ =>
  $('[name="news_keywords"]').attr('content').match(/UUID:([\w-]+)/).pop();

/**
 * Deploy resulting file to final path
 * @return {url} URL to deployed file
 */
module.exports.deploy = () => '@TODO'; // @TODO
