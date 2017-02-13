const cheerio = require('cheerio');
const axios = require('axios');

module.exports.addComments = (event, context) => {
  const item = event.Records.shift(); // Take first item in event; should only be one per event!
  // Construct URL from event parts
  const bucketname = item.s3.bucket.name;
  const bucketRegion = item.awsRegion;
  const key = item.s3.object.key;
  const endpoint = `http://${bucketname}.s3-website-${bucketRegion}.amazonaws.com/${key}`;
  let commentsSnippet = `
    <!-- O-COMMENTS -->
    <div id="comments" style="max-width:800px;margin: 0 auto;"
          data-o-component="o-comments" data-o-comments-config-title="YOUR_HEADLINE_HERE"
          data-o-comments-config-url="https://www.ft.com/content/YOUR_LINKFILE_UUID"
          data-o-comments-config-articleid="YOUR_LINKFILE_UUID">
    </div>
    <link rel="stylesheet" href="https://origami-build.ft.com/v2/bundles/css?modules=o-comments@^3.2.0">
    <script src="https://origami-build.ft.com/v2/bundles/js?modules=o-comments@^3.2.0"></script>
    <style>.comment-header{position:static !important;}</style>
    <!-- END O-COMMENTS -->
`;
 let testSnippet = `<h1>test</h1>`;

  axios.get(endpoint)
    .then(body => {
       let $ = cheerio.load(body);
       $( 'body' ).append(testSnippet);
      // Assuming data contains the HTML body...

      // Pass 1: change relative URLs to image service


      // Pass 2: change absolute AWS paths to image service
      // const pass2 = pass1.replace(absoluteAwsRegex, replaceAbsolute);

      context.success($.html());
    })
    .catch(console.error);

}
