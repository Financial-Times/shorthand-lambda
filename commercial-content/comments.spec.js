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
const fixtureEvent = require(resolve(__dirname, '..', 'test-fixtures', 'test-event.json'));

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

        expect(axiosStub.get).to.have.been.calledOnce;
        done();
      },
    };

    comments.addComments(fixtureEvent, ctx);
  });

  xit('comments snippet has been added before closing html-tag', () => {

  });
});
