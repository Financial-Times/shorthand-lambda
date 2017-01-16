include n.Makefile

deploy:
	@serverless deploy --verbose --region eu-west-1 --stage dev

tidy:
	@serverless remove --verbose --region eu-west-1 --stage dev