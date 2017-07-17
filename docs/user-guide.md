# Commercial Content Publishing App User Guide

## Usage

##### Publishing with Shorthand

The publishing app is integrated with Shorthand. You can use the Shorthand 'publish' option to publish stories directly to our Amazon S3 bucket.

Once the content has been published to the S3 bucket it will be available on FT.com at: https://www.ft.com/paidpost/FOLDER-NAME/index.html where FOLDER-NAME is the name you will choose in step 4 below.

Note that the above URL is not a Vanity URL; the publishing app is  compatible with Vanity URLs. See the Vanity URLs section below.

###### Step-by-step guide

1. Log into Shorthand
2. Click 'Publish' (or 'Republish') in the top-nav
3. Select "FT-Shorthand-Shorthand-staging" option from the 'Server' drop-down
4. In the "path of the story" field you must enter 'paidpost/' followed by any folder name that you choose.
5. The post will then be published on FT.com at ft.com/paidpost/FOLDER-NAME/index.html (where FOLDER-NAME is the name you used in step 4)

##### Publishing with Ceros

Unlike Shorthand, Ceros does not permit users to publish to an AWS s3 bucket directly from the app. However, we are able to use Cyberduck to FTP the downloaded files up to the S3 bucket.

###### Step-by-step guide

1. Ensure that you have a Lastpass account - this is needed to get the AWS username (key-id) and password.
2. Ensure that you have Cyberduck installed on your machine.
3. Download and Unzip your Ceros article files.
4. Open Cyberduck and select "Open Connection"
5. From the top drop-down choose "S3 (Amazon Simple Storage Service)"
6. Server: ft-shorthand-staging.s3.amazonaws.com
7. Username: See Lastpass
8. Password: see last password
9. Path: ft-shorthand-staging/paidpost
9. Click Connect
10. Cyberduck will list the files that have previously been uploaded
11. Copy (drag-drop) your new files into the Cyberduck window.


###### Vanity URLs

In order to get the a vanity URL you will need to use the url-management tool.
Vanity URLs can be used to change the format of the post's URL from
ft.com/paidpost/FOLDER-NAME/index.html to ft.com/paidpost/ANY-NAME-YOU-CHOOSE

The publishing App works with the URL Management Tool for setting Vanity URLs for published content.

See https://url-management.ft.com/
