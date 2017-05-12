/**
 * Spec for Image Service tasks
 */

'use strict';

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const chai = require('chai');
const cheerio = require('cheerio');

const expect = chai.expect;
const fixture = readFileSync(resolve(__dirname, '..', 'test-fixtures', 'index.html'), { encoding: 'utf8' });

const relPathCssJs = require('./rel-path-css-js');

const filePath = 'paidpost/test84';

describe('relPathCssJs.updateUrls', () => {
  it('replaces relative URLs with full-path URLs', () => {
    const result = relPathCssJs(fixture, 'paidpost/test84/index.html');
    const $ = cheerio.load(result);
    const testUrls = [
      './static/build/js/head.3262.min.js',
      './static/build/css/common.3262.min.css',
      '//www.google-analytics.com/analytics.js'
    ];

    const resultLink1 = `https://www.ft.com/${filePath}${testUrls[0].substr(1)}`;
    const resultLink2 = `https://www.ft.com/${filePath}${testUrls[1].substr(1)}`;
    const resultLink3 = `http://www.google-analytics.com/analytics.js`;

    expect($(`#script-test`)[0].attribs.src).to.equal(resultLink1);
    expect($(`#css-test`)[0].attribs.href).to.equal(resultLink2);
    expect($(`#script-test2`)[0].attribs.src).to.equal(resultLink3);
  });

  it('returns void if no body provided', () => {
    const result = relPathCssJs(null);
    expect(result).not.to.exist;
  });
});
