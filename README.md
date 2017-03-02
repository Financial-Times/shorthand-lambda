# Shorthand Lambda
#### _2017 Ændrew Rininsland and Andrew Georgiou, Financial Times_

> Serverless project for deploying Shorthand and Ceros content


This is a Serverless project leveraging AWS Lambda and S3.
It is based off [Ben Fletcher][1]'s excellent *[next-serverless-example][2]*.
Use that for help [generating policies[3] and whathaveyounot.

## Usage

1. Install dependencies
  ```bash
  $ npm install
  ```

2. Create .env file
  This file is used by Serverless to populate environment variables. It is not version controlled.

  ```
  AWS_ACCESS_KEY_ID=<AWS Access Key ID>
  AWS_SECRET_ACCESS_KEY=<AWS Secret Access Key>
  AWS_ROLE=arn:aws:iam::<Lambda's account ID>:role/<Lambda role>
  AWS_DEPLOYMENT_BUCKET=<artefacts bucket>

  AWS_STAGING_BUCKET=ft-shorthand
  AWS_PROD_BUCKET=ft-shorthand-prod
  AWS_PROD_BUCKET_REGION=eu-west
  AWS_PROD_BUCKET_ACCESS_KEY_ID
  AWS_PROD_BUCKET_SECRET_ACCESS_KEY=sj
  ```

3. Deploy!
  ```bash
  $ make deploy
  ```

4. :tada:

## Weirdness

* We created our buckets via the console instead of using Serverless. This is a bad idea.
  Instead, you should configure the buckets as a resource in serverless.yml and let CloudFormation
  take care of them. This will ensure you don't need to manually create the S3 events in Lambda!

##### Special thanks to Vish Bhalla for helping with AWS config!

[1]: https://github.com/bjfletcher
[2]: https://github.com/Financial-Times/next-serverless-example
[3]: https://github.com/Financial-Times/next-serverless-example#keys-role--deployment-bucket
