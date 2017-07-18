/**
 * Spec for Image Service tasks
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const chai = require('chai');
const cheerio = require('cheerio');

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });

const imageService = require('./imageservice');

const bucketName = 'dest-bucket';
const bucketRegion = 'test-region';
const filePath = 'paidpost/test84';
const endpointURI = `http://${bucketName}.s3-website-${bucketRegion}.amazonaws.com`;

describe('imageservice.addUrls', () => {
  it('replaces relative URLs with image service URLs', () => {
    const result = imageService(fixture, 'paidpost/test84/index.html');
    const $ = cheerio.load(result);
    const testUrls = [
      './media/shorthand-logo-horizonal_ur0ijsl.png',
      'media/images/6c8fa676f560ded694e9fdd993009562/arrow-icon.svg'
    ];

    const encodedFullPath = encodeURIComponent(`https://s3-${bucketRegion}.amazonaws.com/${bucketName}/${filePath}${testUrls[0].substr(1)}`);
    const encodedFullPath2 = encodeURIComponent(`https://s3-${bucketRegion}.amazonaws.com/${bucketName}/${filePath}/${testUrls[1]}`);
    const resultLink = `https://www.ft.com/__origami/service/image/v2/images/raw/${encodedFullPath}?source=commercial-content-lambda`;
    const resultLink2 = `https://www.ft.com/__origami/service/image/v2/images/raw/${encodedFullPath2}?source=commercial-content-lambda`;
    expect($(`#header-logo`)[0].attribs.src).to.equal(resultLink);
    expect($(`#cerostest`)[0].attribs.src).to.equal(resultLink2);
  });

  it('replaces Amazon S3 URLs with Image Service URLs', () => {
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
  });

  it('returns void if no body provided', () => {
    const result = imageService(null);
    expect(result).not.to.exist;
  });
});
