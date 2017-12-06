'use strict';
const fetch = require('node-fetch');
const footerScripts = require('./snippets/footer-scripts');
const headHtml = require('./snippets/head');
const headerHtml = require('./snippets/headerHtml');
const footerHtml = require('./snippets/footerHtml');
const navHtml = require('./snippets/navHtml');

const origamiModules = [
  {
    name: "o-grid",
    version: "4.3.3"
  },
  {
    name: "o-header",
    version: "7.0.4"
  },
  {
    name: "o-footer",
    version: "6.0.2"
  },
  {
    name: "o-typography",
    version: "5.1.1"
  },
  {
    name: "o-colors",
    version: "4.1.1"
  },
  {
    name: "o-tooltip",
    version: "2.2.3"
  },
  {
    name: "o-tracking"
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
function getOrigamiUrl($, type) {
  const customOrigamiModules = _getCustomOrigamiModules($);
  return _buildOrigamiUrl(_combineModules(origamiModules, customOrigamiModules), type);
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

function _getCustomOrigamiModules($) {
  const oScript = $('script[src^="https://www.ft.com/__origami/service/build"]');
  if(oScript.is('script') && oScript.attr('src')) {
    const oModules = oScript.attr('src').match(/o-([^&]+)/);
    if(oModules && oModules.length) {
      return _formatModules(oModules[0].split(','));
    }
  }
  return [];
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
  const moduleStrings = modules.map(module => {
    return module.version ? `${module.name}@^${module.version}` : module.name;
  });

  return `https://www.ft.com/__origami/service/build/v2/bundles/${type}?modules=${moduleStrings.join(',')}&autoinit=0`;
}

module.exports = ($, args) => {
  const navData = getNavData();
  const uuid = args && Object.prototype.hasOwnProperty.call(args, 'uuid') ? args.uuid : false;

  return navData.then(data => {
    $('head').prepend(headHtml);
    $('body').prepend(headerHtml);
    $('body').append(footerHtml);
    $('body').append(navHtml(data));
    $('body').append(footerScripts(getOrigamiUrl($, 'js'), getTrackingPageOptions(uuid)));
    replaceTooltipSponsor($);

    return Promise.resolve($);
  });
};
