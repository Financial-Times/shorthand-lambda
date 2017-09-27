/**
 * Spec for o-tracking task
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const cheerio = require('cheerio');
const chai = require('chai');
const oTracking = require('./o-tracking');

const expect = chai.expect;

const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });

const UUIDFixture = '0fb9fc9ff28bec1a871d387c3e788209';

describe('adding o-tracking', () => {
  let $;

  beforeEach(() => {
    $ = cheerio.load(fixture);
  });

  it('should add CTM styles', () => {
    return oTracking($, UUIDFixture).then(result => {
      expect(result('head style#ctm-styles')).not.to.be.empty;
    });
  });

  it('should add CTM', () => {
    return oTracking($, UUIDFixture).then(result => {
      expect(result('head script#ctm')).not.to.be.empty;
    });
  });

  it('should add Polyfill service', () => {
    return oTracking($, UUIDFixture).then(result => {
      expect(result('head script#polyfill-service')).not.to.be.empty;
    });
  });

  it('should add o-tracking instantiation code', () => {
    return oTracking($, UUIDFixture).then(result => {
      expect(result('head script#o-tracking')).not.to.be.empty;
    });
  });

  it('should add core fallback', () => {
    return oTracking($, UUIDFixture).then(result => {
      expect(result('body [data-o-component="o-tracking"]')).not.to.be.empty;
    });
  });
});
