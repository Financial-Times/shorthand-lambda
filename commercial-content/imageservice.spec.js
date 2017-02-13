/**
 * Spec for Image Service tasks
 */
const { readFileSync } = require('fs');
const { resolve } = require('path');
const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const cheerio = require('cheerio');
chai.use(require('sinon-chai'));

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });
const fixtureEvent = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'test-fixtures', 'test-event.json'),
  { encoding: 'utf8' })
);

const axiosStub = {
  get: sinon.stub().returns(Promise.resolve(fixture)),
};

const imageService = proxyquire('./imageservice', {
  axios: axiosStub,
});

const key = 'test-fixture-path/index.html';
const bucketName = 'test-bucket';
const bucketRegion = 'test-region';
const endpointURI = `http://${bucketName}.s3-website-${bucketRegion}.amazonaws.com`;

describe('imageservice.addUrls', () => {
  it('replaces relative URLs with image service URLs', done => {
    const ctx = {
      success: result => {
        const $ = cheerio.load(result);
        const testUrls = [
          './media/shorthand-logo-horizonal_ur0ijsl.png',
          './media/flying_gull-mr.jpg',
        ];

        expect(axiosStub.get).to.have.been.calledOnce;

        for (let i = 0; i < testUrls.length; i++) {
          const modifiedOriginal = encodeURIComponent(`${endpointURI}${testUrls[i].substr(1)}`);
          const resultLink = `https://www.ft.com/__origami/service/image/v2/images/raw${modifiedOriginal}?source=commercial-content-lambda`;
          expect($(`[src="${resultLink}"]`)).to.not.be.empty;
        }

        done();
      },
    };

    imageService.addUrls(fixtureEvent, ctx);
  });

  xit('replaces Amazon S3 URLs with Image Service URLs', () => {

  });
});
