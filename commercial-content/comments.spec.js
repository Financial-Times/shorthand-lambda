/**
 * Spec for Adding Comments task
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
const comments = proxyquire('./comments', {
  'axios': axiosStub,
});

const key = 'test-fixture-path/index.html';
const bucketName = 'test-bucket';
const bucketRegion = 'test-region';
const endpointURI = `http://${bucketName}.s3-website-${bucketRegion}.amazonaws.com`;

describe('comments.addComments', () => {
  it('adds comments snippet before closing html tag', (done) => {
    const ctx = {
      success: result => {
        const $ = cheerio.load(result);
        expect($('#comments').is('div')).to.be.true;
        expect($('#comments').attr('data-o-comments-config-articleid')).to.have.string('0fb9fc9ff28bec1a871d387c3e788209');
        done();
        expect($('#comments').attr('comments-config-title')).to.have.string('Demo story');
      },
    };

    comments.addComments(fixtureEvent, ctx);
  });

  xit('comments snippet has been added before closing html-tag', () => {

  });
});
