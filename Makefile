# Setup environment variables
sinclude .env
export $(shell [ -f .env ] && sed 's/=.*//' .env)
# ./node_modules/.bin on the PATH
SHELL := /bin/bash
export PATH := ./node_modules/.bin:$(PATH)

deploy:
	@serverless deploy --verbose --region eu-west-1 --stage dev
	@serverless s3deploy

s3deploy:
	@serverless s3deploy

tidy:
	@serverless remove --verbose --region eu-west-1 --stage dev
