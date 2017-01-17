<img src="http://financial-times.github.io/next/img/serverless-output-example.png" width="75%" />

# Introduction

This tutorial is intended to introduce you to serverless computing in Next.

Serverless what?  [Google explains](https://www.google.co.uk/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=serverless%20definition). It is, like, function as a service.

What better way to introduce than to create, deploy and update a full-blown serverless application?

Pick one example from [the collection of Serverless examples](https://github.com/serverless/examples). OMG!

What? Oh alright. The biggest one. REST API with DynamoDB!  This example lets you create, retrieve, update and delete "todos". A common denominator of apps. :-)

```sh
git clone git@github.com:serverless/examples
mv examples serverless-examples
cd serverless-examples/aws-node-rest-api-with-dynamodb
```

Note that there's a directory called "todos":

```
todos
 | create.js
 | delete.js
 | get.js
 | list.js
 | update.js
```

### Impatient?

```sh
git clone git@github.com:financial-times/next-serverless-example
cd next-serverless-example
make install
```

and skip to [Deploy it](#deploy-it). Whoooo.

# FT-ify and Next-ify the example

Righto. We need to make some tweaks to get it to work in the FT.

## serverless.yml

Make the following changes in the `serverless.yml`:

```diff
-service: serverless-rest-api-with-dynamodb
+service: ft-next-app-noob
```

You will need to make up a unique (and more respected) system code to replace `ft-next-app-noob` with.  It needs to start with `ft-next-` and end with a name of your choosing.  This will be the "prefix" name for all the resources it creates in the cloud.  Now...

```diff
-  iamRoleStatements:
-    - Effect: Allow
-      Action:
-        - dynamodb:DescribeTable
-        - dynamodb:Query
-        - dynamodb:Scan
-        - dynamodb:GetItem
-        - dynamodb:PutItem
-        - dynamodb:UpdateItem
-        - dynamodb:DeleteItem
-      Resource: "arn:aws:dynamodb:us-east-1:*:*"
+  role: ${env:AWS_ROLE}
+  deploymentBucket: ${env:AWS_DEPLOYMENT_BUCKET}
```

That's because we're going to have a role and a deployment bucket created for us by the cool FT tooling, details of which we will then put in `.env`. All that will come up shortly.

Following that:

```diff
+  environment:
+    TODOS_TABLE_NAME: ft-next-app-noob-${opt:stage}_todos
```

To avoid hardcoding the table name in the different functions, we'll create the environment variable and use it.  So, in `todos/(create|delete|get|list).js` files:

```diff
-        TableName: 'todos',
+        TableName: process.env.TODOS_TABLE_NAME,
```

Back in `serverless.yml`, update the DynamoDB table definition:

```diff
-        TableName: 'todos'
+        TableName: ft-next-app-noob_${opt:stage}_todos
```

Finally, put this at the bottom:

```diff
+package:
+  exclude:
+    - node_modules/serverless/**
```

which is not used by the application itself. In Next, every little performance tweak helps. :-)

## Makefile

Create a `Makefile` with tasks to deploy and remove the application.

If in Next, ensure [n-makefile](https://github.com/financial-times/n-makefile) is present in the folder:

```
include n.Makefile
```

else:

```sh
# Setup environment variables
sinclude .env
export $(shell [ -f .env ] && sed 's/=.*//' .env)
# ./node_modules/.bin on the PATH
export PATH := ./node_modules/.bin:$(PATH)
```

Add the following tasks:

```
deploy:
  @serverless deploy --verbose --region eu-west-1 --stage dev

tidy:
  @serverless remove --verbose --region eu-west-1 --stage dev
```

## Serverless tooling

Either:

```sh
npm install -g serverless
```

or

```sh
npm install --save-dev serverless
```

Tough decision... I figure the latter is better because we can ensure everyone has the same version.

## Keys, role & deployment bucket

Progress. I've left the most uninspiring task to last!

We need to get a key with which to setup all the AWS access keys (secrets!), role and deployment bucket for our application. I have good news and bad news.

### Get a key to setup access

The good news is that we are so modern that we can get the key through a Slackbot! Boom-boom.  In Slack, in any channel (noone will know):

```
/devkeyfor kon_policygen personal
```

Then check your email and through that you should see an `apiKey` field which is what you want.

### Setup access

Now the bad news is that the Konstructor webpage with which we use to setup access for applications is more confusing than knowing whether Father Santa exists.  Let's do it a better way: `cURL`.

Replace `YOUR_API_KEY_IN_HERE` with the aforementioned key and the system code name:

```sh
curl -H 'x-api-key: YOUR_API_KEY_IN_HERE' -X POST -d '{
     "systemCode": "ft-next-app-noob",
     "policyDescription": "Next app by noob",
     "performTestRun": "false",
     "requireS3": {
       "artefacts": true,
       "application": true
     },
     "requireLambda": true,
     "requireApiGateway": true,
     "requireDynamo": true,
     "requireKinesis": true,
     "requireCloudformation": {
       "required": true,
       "changeRequestSetName": "Serverless-2016-10-31"
     }
}' https://awspolicy-api-d.in.ft.com/v1/create > policy.json
```

This `policy.json` will now have the all the information we need.

## .env

Pick the bits we need from the `policy.json` and put in a new `.env` file:

```sh
node -e 'const p = require("./policy.json");
		console.log(`AWS_ACCESS_KEY_ID=${p.accessKey.accessKeyId}`);
		console.log(`AWS_SECRET_ACCESS_KEY=${p.accessKey.secretAccessKey}`);
		console.log(`AWS_ROLE=${p.role.arn}`);
		console.log(`AWS_DEPLOYMENT_BUCKET=${p.artefactBucket.name}`);' > .env
rm policy.json
```

This is just brilliance. :-) The excitement can now begin!

# Deploy it

Wooo.

```sh
make deploy
```

and you should see something like:

```sh
$ make deploy
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (10.3 KB)...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
CloudFormation - CREATE_IN_PROGRESS - AWS::CloudFormation::Stack - ft-next-app-noob-dev
CloudFormation - CREATE_IN_PROGRESS - AWS::DynamoDB::Table - TodosDynamoDbTable
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - UpdateLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - CreateLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - ListLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::DynamoDB::Table - TodosDynamoDbTable
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - DeleteLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - UpdateLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - ListLambdaFunction
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Function - UpdateLambdaFunction
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Function - ListLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - CreateLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - DeleteLambdaFunction
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Function - CreateLambdaFunction
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Function - DeleteLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - GetLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::RestApi - ApiGatewayRestApi
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Function - GetLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::RestApi - ApiGatewayRestApi
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Function - GetLambdaFunction
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::RestApi - ApiGatewayRestApi
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - DeleteLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - CreateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - UpdateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - CreateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - ListLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - CreateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - UpdateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - DeleteLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - UpdateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - DeleteLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - ListLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - CreateLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - ListLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - ListLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - GetLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - UpdateLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - CreateLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - ListLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - UpdateLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodos
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - GetLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - GetLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodos
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - GetLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - GetLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Resource - ApiGatewayResourceTodos
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - DeleteLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Permission - DeleteLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosGet
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodosIdVar
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosOptions
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosGet
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodosIdVar
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosPost
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosOptions
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Resource - ApiGatewayResourceTodosIdVar
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosGet
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosPost
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosOptions
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosPost
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarDelete
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarOptions
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarPut
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarDelete
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarGet
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarPut
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarOptions
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarDelete
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarPut
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarOptions
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarGet
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Permission - CreateLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarGet
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Permission - ListLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Permission - UpdateLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Permission - GetLambdaPermissionApiGateway
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Permission - DeleteLambdaPermissionApiGateway
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeployment1484586575524
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeployment1484586575524
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Deployment - ApiGatewayDeployment1484586575524
CloudFormation - CREATE_COMPLETE - AWS::DynamoDB::Table - TodosDynamoDbTable
CloudFormation - CREATE_COMPLETE - AWS::CloudFormation::Stack - ft-next-app-noob-dev
Serverless: Stack create finished...
Service Information
service: ft-next-app-noob
stage: dev
region: eu-west-1
api keys:
  None
endpoints:
  POST - https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev/todos
  GET - https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev/todos
  GET - https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev/todos/{id}
  PUT - https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev/todos/{id}
  DELETE - https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev/todos/{id}
functions:
  ft-next-app-noob-dev-update: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-update
  ft-next-app-noob-dev-get: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-get
  ft-next-app-noob-dev-list: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-list
  ft-next-app-noob-dev-create: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-create
  ft-next-app-noob-dev-delete: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-delete

Stack Outputs
UpdateLambdaFunctionArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-update
DeleteLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-delete:1
CreateLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-create:1
GetLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-get:1
UpdateLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-update:1
GetLambdaFunctionArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-get
ListLambdaFunctionArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-list
CreateLambdaFunctionArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-create
ListLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-list:1
ServiceEndpoint: https://llzjg0qnl1.execute-api.eu-west-1.amazonaws.com/dev
ServerlessDeploymentBucketName: artefacts.ft-next-app-noob-1h7j4i9qtpmi8
DeleteLambdaFunctionArn: arn:aws:lambda:eu-west-1:371548805176:function:ft-next-app-noob-dev-delete
```

# Update or delete it all

The deployment is completely managed ("Infrastructure as Code") and so it's just as easy to update (by running `make deploy` again) and to delete:

```sh
$ make tidy
Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
CloudFormation - DELETE_IN_PROGRESS - AWS::CloudFormation::Stack - ft-next-app-noob-dev
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Permission - ListLambdaPermissionApiGateway
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosOptions
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Permission - GetLambdaPermissionApiGateway
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Permission - UpdateLambdaPermissionApiGateway
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeployment1484586575524
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - ListLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - GetLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - DeleteLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarOptions
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Permission - CreateLambdaPermissionApiGateway
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - CreateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosOptions
CloudFormation - DELETE_SKIPPED - AWS::DynamoDB::Table - TodosDynamoDbTable
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarOptions
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Deployment - ApiGatewayDeployment1484586575524
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - UpdateLambdaVersion9SWsH6TSK4PXXfCNvAphLe1VTehQVAcjXlrafTd60w
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Permission - DeleteLambdaPermissionApiGateway
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarPut
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosPost
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarDelete
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarGet
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosPost
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarPut
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodTodosGet
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarGet
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosIdVarDelete
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodTodosGet
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodosIdVar
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Resource - ApiGatewayResourceTodosIdVar
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourceTodos
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Resource - ApiGatewayResourceTodos
CloudFormation - DELETE_COMPLETE - AWS::Lambda::Permission - ListLambdaPermissionApiGateway
CloudFormation - DELETE_COMPLETE - AWS::Lambda::Permission - UpdateLambdaPermissionApiGateway
CloudFormation - DELETE_COMPLETE - AWS::Lambda::Permission - CreateLambdaPermissionApiGateway
CloudFormation - DELETE_COMPLETE - AWS::Lambda::Permission - GetLambdaPermissionApiGateway
CloudFormation - DELETE_COMPLETE - AWS::Lambda::Permission - DeleteLambdaPermissionApiGateway
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Function - ListLambdaFunction
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Function - CreateLambdaFunction
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Function - UpdateLambdaFunction
CloudFormation - DELETE_IN_PROGRESS - AWS::Lambda::Function - GetLambdaFunction
Serverless: Stack removal finished...
```

# FAQs

## I've forgotten what the URLs are for my application

Add a task to the `Makefile`:

```
info:
	@serverless info --verbose --region eu-west-1 --stage prod
```

and run it.

## How do I get multiple applications to work together?

Ask Ben about using [Exporting Stack Output Values](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-exports.html) which outputs useful information such as references for use by other applications.

## How to test?

You can test locally using `serverless invoke local --stage dev --function list` (you may need to `npm install --save aws-sdk` - not forgetting to exclude this in `serverless.yml` because it's already available in the Lambda container).

You can test the deployed function using the same command as above but without `local`.

Please read also: [Serverless testing](https://serverless.com/framework/docs/providers/aws/guide/testing/)

## What about CircleCI and logging?

That's a Work in Progress.  Contact us for the latest update. :-)

# Problems?

Please contact Ben Fletcher or #ft-next-platform (if Next), or #cloud-enablement.

# More reading

I highly recommend:

- [Serverless framework guide](https://serverless.com/framework/docs/providers/aws/guide/intro/) - how to use the Serverless framework
- [AWS Resource Property Types Reference](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-property-reference.html) - help with `Resources` section... what properties are required, what they do, etc.
- [Serverless repo](https://github.com/serverless/serverless) - where you can search for issues
- [Serverless testing](https://serverless.com/framework/docs/providers/aws/guide/testing/) - some ideas regarding serverless testing (don't forget you've got `dev` and have a look at `serverless --help` regarding invoking functions locally)
