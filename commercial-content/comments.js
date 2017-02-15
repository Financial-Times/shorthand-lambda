const cheerio = require('cheerio');
const axios = require('axios');
const utils = require('./utils');
module.exports.addComments = (event, context) => {
  const item = event.Records.shift(); // Take first item in event; should only be one per event!
  // Construct URL from event parts
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;
  const endpoint = `http://${bucketname}.s3-website-${bucketRegion}.amazonaws.com/${key}`;



  axios.get(endpoint)
    .then(body => {
       let $ = cheerio.load(body);
      const uuid = utils.getUUID($.html());
       let headline = $('title').text();
       let commentsSnippet = `
         <!-- O-COMMENTS -->
         <div id="comments" style="max-width:800px;margin: 0 auto;"
               data-o-component="o-comments" data-o-comments-config-title="${headline}"
               data-o-comments-config-url="https://www.ft.com/content/${uuid}"
               data-o-comments-config-articleid="${uuid}">
         </div>
         <link rel="stylesheet" href="https://origami-build.ft.com/v2/bundles/css?modules=o-comments@^3.2.0">
         <script src="https://origami-build.ft.com/v2/bundles/js?modules=o-comments@^3.2.0"></script>
         <style>.comment-header{position:static !important;}</style>
         <!-- END O-COMMENTS -->
       `;
       $( 'body' ).append(commentsSnippet);
      
      context.success($.html());
    })
    .catch(console.error);

}
