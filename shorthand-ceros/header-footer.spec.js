/**
 * Tests for Comments task
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const chai = require('chai');
const cheerio = require('cheerio');
const headerFooter = require('./header-footer');

chai.use(require('sinon-chai'));

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });
const ArgsFixture = {
  uuid: '0fb9fc9ff28bec1a871d387c3e788209'
};

describe('headerFooter', () => {
  let $;

  beforeEach(() => {
    $ = cheerio.load(fixture);
  });

  it('adds comments snippet before closing html tag', () => {
    const result = headerFooter($, ArgsFixture);
    expect(result('.o-header').is('header')).to.be.true;
  });
});
