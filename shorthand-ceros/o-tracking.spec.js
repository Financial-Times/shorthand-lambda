/**
 * Spec for o-tracking task
 */

const { readFileSync } = require('fs');
const { resolve } = require('path');
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
    const result = oTracking($, UUIDFixture);

    expect(result('head style#ctm-styles')).not.to.be.empty;
  });

  it('should add CTM', () => {
    const result = oTracking($, UUIDFixture);

    expect(result('head script#ctm')).not.to.be.empty;
  });

  it('should add Polyfill service', () => {
    const result = oTracking($, UUIDFixture);

    expect(result('head script#polyfill-service')).not.to.be.empty;
  });

  it('should add o-tracking instantiation code', () => {
    const result = oTracking($, UUIDFixture);

    expect(result('head script#o-tracking')).not.to.be.empty;
  });

  it('should add core fallback', () => {
    const result = oTracking($, UUIDFixture);
    expect(result('body [data-o-component="o-tracking"]')).not.to.be.empty;
  });
});
