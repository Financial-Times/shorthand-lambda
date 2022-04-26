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

  context('Header', () => {
    it('adds the FT header', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.o-header').is('header')).to.be.true;
      });
    });

    it('adds the paid-post banner with a tooltip', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#disclaimer').is('div')).to.be.true;
        expect(result('#paid-post-tooltip').attr('data-o-component')).to.equal('o-tooltip');
        expect(result('.o-tooltip-content').is('div')).to.be.true;
      });
    });

    it('adds the cuts the mustard script', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#cuts-the-mustard').is('script')).to.be.true;
      });
    });

    it('adds the polyfill script', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#polyfill').is('script')).to.be.true;
        expect(result('#polyfill').attr('src')).to.equal('https://cdn.polyfill.io/v2/polyfill.min.js');
      });
    });

    it('adds the origami build service stylesheet', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('link[rel="stylesheet"]').attr('href')).to.include('https://www.ft.com/__origami/service/build/v3/bundles/css');
      });
    });
  });

  context('Footer ', () => {
    it('adds the FT footer', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.o-footer').is('footer')).to.be.true;
      });
    });

    it('adds the custom javascript', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#ft-js').is('script')).to.be.true;
      });
    });
  });

  context('Nav', () => {
    it('adds the Nav', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#o-header-drawer').is('div')).to.be.true;
      });
    });
  });

  context('Tooltip', () => {
    it('should replace the tooltip sponsor', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('.disclaimer__sponsor').text()).to.equal('by HIUNDAI');
        expect(result('.paid-post-tooltip__sponsor').text()).to.equal('HIUNDAI');
        expect(result('meta[name="tooltip:sponsor"]').text()).to.not.be.ok;
      });
    });
  });

  context('Origami scripts', () => {
    it('should aggregate origami scripts into one', () => {
      const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index--origami-tag.html'), { encoding: 'utf8' });
      $ = cheerio.load(fixture);

      return headerFooter($, ArgsFixture).then(result => {
        expect(result('head').html()).to.include('https://www.ft.com/__origami/service/build/v3/bundles/css?components=o-grid@^6.1.5,o-header@^10.0.1,o-footer@^9.2.2,o-typography@^7.3.2,o-colors@^6.4.2,o-tooltip@^5.2.2,o-autoinit@^3.1.3,o-fonts@^5.3.3,o-share@^8.2.2,o-normalise@^3.2.2,o-overlay@^4.2.4,o-buttons@^7.5.0&amp;system_code=ft-shorthand-ceros-publishing&amp;brand=master');
        expect(result('body').html()).to.include('https://www.ft.com/__origami/service/build/v3/bundles/js?components=o-grid@^6.1.5,o-header@^10.0.1,o-footer@^9.2.2,o-typography@^7.3.2,o-colors@^6.4.2,o-tooltip@^5.2.2,o-tracking@^4.3.2,o-viewport@^5.1.1,o-autoinit@^3.1.3,o-fonts@^5.3.3,o-share@^8.2.2,o-normalise@^3.2.2,o-overlay@^4.2.4,o-buttons@^7.5.0&amp;system_code=ft-shorthand-ceros-publishing');
      });
    });
  });


  // Hard to test this properly as copying and pasting code from n-ui and hacking
  // to work with this app. NAUGHTY. DO IT PROPERLY.
  context('Events', () => {
    it('should return javascript with events', () => {
      return headerFooter($, ArgsFixture).then(result => {
        expect(result('#ft-events').is('script')).to.be.true;
      });
    });
  });
});
