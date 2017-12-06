/**
 * Spec for Main workflow
 */

'use strict';

process.env.DEST_BUCKET = 'dest-bucket';
process.env.DEST_BUCKET_REGION = 'test-region';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const proxyquire = require('proxyquire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;
const MockS3 = sinon.stub();
MockS3.prototype.getObject = sinon.stub();
const stubDeploy = sinon.stub();
const stubDeployAsset = sinon.stub();

const main = proxyquire('./main', {
  './utils': {
    deploy: stubDeploy,
    deployAsset: stubDeployAsset,
  },
  'aws-sdk': {
    S3: MockS3,
  }
}).main;

const fixturePage = readFileSync(
  resolve(__dirname, '..', 'test-fixtures', 'index.html'),
  { encoding: 'utf8' }
);
const fixturePageNoUUID = readFileSync(
  resolve(__dirname, '..', 'test-fixtures', 'index--no-uuid.html'),
  { encoding: 'utf8' }
);
const fixturePageOrigamiTag = readFileSync(
  resolve(__dirname, '..', 'test-fixtures', 'index--origami-tag.html'),
  { encoding: 'utf8' }
);

let fixtureEventPage;
let fixtureEventAsset;
describe('main.js', () => {
  beforeEach(() => {
    MockS3.reset();
    MockS3.prototype.getObject.reset();
    fixtureEventPage = JSON.parse(readFileSync(
      resolve(__dirname, '..', 'test-fixtures/test-event.json')));
    fixtureEventAsset = JSON.parse(readFileSync(
      resolve(__dirname, '..', 'test-fixtures/test-event-asset.json')));
  });

  const resultStringBase = 'Deployed to: http://dest-bucket.s3-website-test-region.amazonaws.com/';
  describe('processing HTML', () => {
    it('processes HTML with UUID', done => {
      MockS3.prototype.getObject.yields(null, { Body: fixturePage });
      stubDeploy.returns(Promise.resolve('test-fixture-path/index.html'));

      main(fixtureEventPage, {}, (err, result) => {
        expect(err).not.to.exist;
        expect(result).to.equal(resultStringBase + 'test-fixture-path/index.html');
        done();
      });
    });

    it('processes HTML without UUID', done => {
      MockS3.prototype.getObject.yields(null, { Body: fixturePageNoUUID });
      stubDeploy.returns(Promise.resolve('test-fixture-path/index.html'));

      main(fixtureEventPage, {}, (err, result) => {
        expect(err).not.to.exist;
        expect(result).to.equal(resultStringBase + 'test-fixture-path/index.html');
        done();
      });
    });

    it('processes HTML with origami script tags', done => {
      MockS3.prototype.getObject.yields(null, { Body: fixturePageOrigamiTag });
      stubDeploy.returns(Promise.resolve('test-fixture-path/index.html'));

      main(fixtureEventPage, {}, (err, result) => {
        expect(err).not.to.exist;
        expect(result).to.equal(resultStringBase + 'test-fixture-path/index.html');
        done();
      });
    });

    it('calls back with error on getObject error', done => {
      MockS3.prototype.getObject.yields(new Error('hurrrr'));
      main(fixtureEventPage, {}, (err, result) => {
        expect(result).not.to.exist;
        expect(err).to.eql(new Error('hurrrr'));
        done();
      });
    });

    it('calls back with error on deploy error', done => {
      MockS3.prototype.getObject.yields(null, { Body: fixturePage });
      stubDeploy.returns(Promise.reject(new Error('hurrrr')));

      main(fixtureEventPage, {}, (err, result) => {
        expect(result).not.to.exist;
        expect(err).to.eql(new Error('hurrrr'));
        done();
      });
    });
  });

  describe('processing assets', () => {
    stubDeployAsset.returns(Promise.resolve('test-fixture-path/index.jpg'));
    it('calls back with result URL', done => {
      main(fixtureEventAsset, {}, (err, result) => {
        expect(err).not.to.exist;
        expect(result).to.equal(resultStringBase + 'test-fixture-path/index.jpg');
        done();
      });
    });
  });
});
