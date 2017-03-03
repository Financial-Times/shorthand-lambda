/**
 * Spec for Image Service tasks
 */

const { readFileSync } = require('fs');
const { resolve } = require('path');
const chai = require('chai');
const cheerio = require('cheerio');

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });

const imageService = require('./imageservice');

const bucketName = 'test-bucket';
const bucketRegion = 'test-region';
const endpointURI = `http://${bucketName}.s3-website-${bucketRegion}.amazonaws.com`;

describe('imageservice.addUrls', () => {
  it('replaces relative URLs with image service URLs', done => {
    const result = imageService(fixture);
    const $ = cheerio.load(result);
    const testUrls = [
      './media/shorthand-logo-horizonal_ur0ijsl.png',
      './media/flying_gull-mr.jpg',
    ];

    for (let i = 0; i < testUrls.length; i++) {
      const modifiedOriginal = encodeURIComponent(`${endpointURI}${testUrls[i].substr(1)}`);
      const resultLink = `https://www.ft.com/__origami/service/image/v2/images/raw${modifiedOriginal}?source=commercial-content-lambda`;
      expect($(`[src="${resultLink}"]`)).to.not.be.empty;
    }

    done();
  });

  it('replaces Amazon S3 URLs with Image Service URLs', done => {
    const result = imageService(fixture);
    const $ = cheerio.load(result);
    const testUrls = [
      'http://ft-ig-content-prod.s3-website-eu-west-1.amazonaws.com/test/static/img/created-with-shorthand.png',
      'http://ft-ig-content-prod.s3-website-eu-west-1.amazonaws.com/test/static/img/chevron-v1.png',
    ];

    for (let i = 0; i < testUrls.length; i++) {
      const modifiedOriginal = encodeURIComponent(`${endpointURI}${testUrls[i].substr(1)}`);
      const resultLink = `https://www.ft.com/__origami/service/image/v2/images/raw${modifiedOriginal}?source=commercial-content-lambda`;
      expect($(`[src="${resultLink}"]`)).to.not.be.empty;
    }

    done();
  });
});
