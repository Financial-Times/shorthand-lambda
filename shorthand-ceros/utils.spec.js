/**
 * Spec for Utils
 */

const { readFileSync } = require('fs');
const { resolve } = require('path');
const cheerio = require('cheerio');
const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
chai.use(require('sinon-chai'));

const MockS3 = sinon.stub();
MockS3.prototype.putObject = sinon.stub();
MockS3.prototype.copyObject = sinon.stub();

process.env.DEST_BUCKET = 'dest-bucket';
process.env.SOURCE_BUCKET = 'source-bucket';

const utils = proxyquire('./utils', {
  'aws-sdk': {
    S3: MockS3,
  }
});

const expect = chai.expect;

describe('tests for the Utils module', () => {
  beforeEach(() => {
    MockS3.restore();
    MockS3.prototype.putObject.restore();
    MockS3.prototype.copyObject.restore();
  });

  describe('getUUID', () => {
    it('returns a UUID given a HTML DOM string', () => {
      const fixture = readFileSync(
        resolve(__dirname, '..', 'test-fixtures', 'index.html'),
        { encoding: 'utf8' }
      );

      const result = utils.getUUID(cheerio.load(fixture));

      expect(result).to.be.a('string');
      expect(result).to.equal('0fb9fc9ff28bec1a871d387c3e788209');
    });
  });

  describe('deploy', () => {
    const itemFixture = {
      s3: {
        object: {
          key: 'test/key.html',
        },
      },
    };

    it('puts the object on S3', done => {
      const putArgs = {
        Bucket: 'dest-bucket',
        ACL: 'public-read',
        ContentType: 'text/html',
        Key: 'test/key.html',
      };

      utils.deploy(itemFixture, 'herpa-derpa')
        .then(result => {
          expect(MockS3.prototype.putObject).withArgs(putArgs).to.have.been.calledOnce;
          expect(result).to.equal('test/key.html');
          done();
        })
        .catch(err => {
          expect(MockS3.prototype.putObject).withArgs(putArgs)
            .to.have.been.calledOnce;
          expect(err).not.to.exist;
          done();
        });
    });
  });

  describe('deployAsset', () => {
    it('copies an asset to S3', done => {
      utils.deployAsset('test/key.jpg')
        .then(() => {

        });
        .catch();
    });
  });
});
