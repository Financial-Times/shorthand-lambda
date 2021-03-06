/**
 * Tests for Comments task
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const chai = require('chai');
const cheerio = require('cheerio');
const comments = require('./comments');

chai.use(require('sinon-chai'));

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });
const ArgsFixture = {
  uuid: '0fb9fc9ff28bec1a871d387c3e788209',
  comments: true,
};

describe('comments', () => {
  let $;

  beforeEach(() => {
    $ = cheerio.load(fixture);
  });

  it('adds comments snippet before closing html tag', () => {
    return comments($, ArgsFixture).then(result => {
      expect(result('#comments').is('div')).to.be.true;
      expect(result('#comments').attr('data-o-comments-config-articleid')).to.have.string(ArgsFixture.uuid);
      expect(result('#comments').attr('data-o-comments-config-title')).to.have.string('Demo story');
    });
  });

  it('adds the comment snippet before closing html-tag', () => {
    return comments($, ArgsFixture).then(result => {
      const commentNodes = result('body').contents().filter(function () {
        return this.nodeType === 8;
      });
      expect(commentNodes.last().get(0).nodeValue.trim()).to.equal('END O-COMMENTS');
    });
  });
});
