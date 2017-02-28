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
const axiosStub = {
  get: sinon.stub().returns(Promise.resolve(fixture)),
};
const comments = proxyquire('./comments', {
  axios: axiosStub,
});

let $ = cheerio.load(fixture);
describe('comments', () => {
  it('adds comments snippet before closing html tag', done => {
    comments($, '0fb9fc9ff28bec1a871d387c3e788209');
    expect($('#comments').is('div')).to.be.true;
    expect($('#comments').attr('data-o-comments-config-articleid')).to.have.string('0fb9fc9ff28bec1a871d387c3e788209');
    expect($('#comments').attr('data-o-comments-config-title')).to.have.string('Demo story');
    done();
  });

  xit('comments snippet has been added before closing html-tag', () => {

  });
});
