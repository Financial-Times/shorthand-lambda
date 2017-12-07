'use strict';
const fetch = require('node-fetch');
const footerScripts = require('./snippets/footer-scripts');
const headScripts = require('./snippets/head-scripts');
const headerHtml = require('./snippets/header-html');
const footerHtml = require('./snippets/footer-html');
const navHtml = require('./snippets/nav-html');

const origamiModules = [
  {
    name: "o-grid",
    version: "4.3.3",
    css: true,
    js: true
  },
  {
    name: "o-header",
    version: "7.0.4",
    css: true,
    js: true,
  },
  {
    name: "o-footer",
    version: "6.0.2",
    css: true,
    js: true
  },
  {
    name: "o-typography",
    version: "5.1.1",
    css: true,
    js: true
  },
  {
    name: "o-colors",
    version: "4.1.1",
    css: true,
    js: true
  },
  {
    name: "o-tooltip",
    version: "2.2.3",
    css: true,
    js: true
  },
  {
    name: "o-tracking",
    css: false,
    js: true
  }
];


function getNavData() {
  return fetch('http://ft-next-navigation.s3-website-eu-west-1.amazonaws.com/json/external.json')
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json.native_ad_drawer;
    })
    .catch(err => {
      console.log(err);
    });
}

function replaceTooltipSponsor($) {
  const sponsor = $('meta[name="sponsor"]').attr('content');
  $('.disclaimer__sponsor').text(`BY ${sponsor}`);
}


function getTrackingPageOptions(uuid) {
  return `
  {
    content: { 
      ${uuid ? `uuid: '${uuid}',` : ''}
      asset_type: 'page'
    }
  }
  `;
}

/**
 * We allow a user to pass in an origami script tag.
 * We aggregate the modules with the basic ones we need for this transform
 * and output the final URL
 * @param $
 * @param type ('js' | 'css')
 */
function getOrigamiScriptUrl($) {
  const customOrigamiModules = _getCustomOrigamiScriptModules($);
  const JsOrigamiModules = origamiModules.filter(module => module.js === true);
  return _buildOrigamiUrl(_combineModules(JsOrigamiModules, customOrigamiModules), 'js');
}

function getOrigamiCssUrl($) {
  const customOrigamiModules = _getCustomOrigamiCssModules($);
  const CssOrigamiModules = origamiModules.filter(module => module.css === true);
  return _buildOrigamiUrl(_combineModules(CssOrigamiModules, customOrigamiModules), 'css');
}


// Helper functions for the above
function _formatModules(modules) {
  return modules.map((module => {
    const m = module.split("@");
    return {
      name: m[0],
      version: m.length === 2 ? m[1].substring(1) : null
    };
  }));
}

function _getCustomOrigamiScriptModules($) {
  const oScript = $('script[src^="https://www.ft.com/__origami/service/build/v2/bundles/js"]');
  let modules = [];

  if(oScript.is('script') && oScript.attr('src')) {
    const oModules = oScript.attr('src').match(/o-([^&]+)/);
    if(oModules && oModules.length) {
      modules = _formatModules(oModules[0].split(','));
    }
  }
  // Delete the original script;
  oScript.remove();
  return modules;
}

function _getCustomOrigamiCssModules($) {
  const oCss = $('link[href^="https://www.ft.com/__origami/service/build/v2/bundles/css"]');
  let modules = [];

  if(oCss.is('link') && oCss.attr('href')) {
    const oModules = oCss.attr('href').match(/o-([^&]+)/);
    if(oModules && oModules.length) {
      modules = _formatModules(oModules[0].split(','));
    }
  }
  // Delete the original script;
  oCss.remove();
  return modules;
}

function _combineModules(basicModules, customModules) {
  const modules = basicModules;
  customModules.forEach(item => {
    let found = basicModules.find((obj) => {
      return obj.name === item.name;
    });
    if(!found) modules.push(item);
  });

  return modules;
}


// Type must be `js` or `css` otherwise you'll get a broken url
function _buildOrigamiUrl(modules, type) {
  const modulesWithVersion = modules.map(module => {
    return module.version ? `${module.name}@^${module.version}` : module.name;
  });

  return `https://www.ft.com/__origami/service/build/v2/bundles/${type}?modules=${modulesWithVersion.join(',')}${ type === 'js' ? '&autoinit=0' : ''}`;
}

module.exports = ($, args) => {
  const navData = getNavData();
  const uuid = args && Object.prototype.hasOwnProperty.call(args, 'uuid') ? args.uuid : false;

  return navData.then(data => {
    $('head').prepend(headScripts(getOrigamiCssUrl($)));
    $('body').prepend(headerHtml);
    $('body').append(footerHtml);
    $('body').append(navHtml(data));
    $('body').append(footerScripts(getOrigamiScriptUrl($), getTrackingPageOptions(uuid)));
    replaceTooltipSponsor($);

    return Promise.resolve($);
  });
};
