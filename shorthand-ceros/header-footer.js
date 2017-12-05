'use strict';
const fetch = require('node-fetch');

const headSnippet = `
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-grid@^4.2.0,o-header@^7.0.4,o-footer@^6.0.2,o-typography@^5.0.1,o-colors@^4.0.1,o-tooltip@^2.2.3" />
    <script id="cuts-the-mustard">
        var cutsTheMustard = ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window);
        if (cutsTheMustard) {
            // Swap the 'core' class on the HTML element for an 'enhanced' one
            // We're doing it early in the head to avoid a flash of unstyled content
            document.documentElement.className = document.documentElement.className.replace(/\bcore\b/g, 'enhanced');
        }
    </script>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js" id="polyfill"></script>

	<!--[if lte IE 9]>
	<style>
		.disclaimer__left {
			margin-top: 10px;
		}
	</style>
	<![endif]-->

	<!--[if lt IE 9]>
	<style>
		.o-header__top-logo {
			height: 40px;
			width: 500px;
		}
	</style>
	<![endif]-->

	<style>
		* {
			box-sizing: border-box;
		}

		/* Hide any enhanced experience content when in core mode, and vice versa. */
		.core .o--if-js,
		.enhanced .o--if-no-js { display: none !important; }

		body, html {
			margin: 0;
			padding: 0;
		}

		body {

			background-color: #FFF1E0;
		}

		.o-header__drawer,
		.o-header {
			font-family: MetricWeb,sans-serif;
			font-size: 18px;
		}

		.o-header__top-logo {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.o-footer {
			font-family: MetricWeb,sans-serif;
			font-size: 12px;
		}


		.disclaimer {
		    position: static !important;
		}

		.disclaimer__box {
			position: absolute;
			top: 88px;
			display: block;
			padding: 10px;
			background-color: white;
			font-family: MetricWeb, sans-serif;
			font-size: 13px;
			border: 1px solid #DADADA;
			cursor: pointer;
			z-index: 99999;
		}

		.disclaimer__box.sticky {
			position: fixed;
			top: 0;
		}


		.disclaimer.disclaimer--fixed {
			position: fixed;
			top: 10px;
		}

		.disclaimer__paid-post {
			background-color: #008040;
			color: white;
			display: inline-block;
			font-size: 12px;
			line-height: normal;
			padding: 0.2em 0.6em;
			vertical-align: -1px;
		}

		.disclaimer__sponsor {
			font-weight: 600;
		}

		.disclaimer__info {
			position: relative;
			display: inline-block;
			margin-left: 10px;
			padding: 0 6px;
			border: 2px solid #CCC;
			border-radius: 20px;
			color: #CCC;
			font-size: 13px;
			text-decoration: none;
			line-height: 14px;
		}

		.disclaimer .o-tooltip-content {
			font-size: 13px;
			margin-right: 50px;
			padding-top: 10px;
			padding-bottom: 10px;
		}

		.disclaimer .o-tooltip-content sup {
			font-size: 9px;
			position: absolute;
			top: 4px;
		}

		.o-tooltip--arrow-above.sticky {
			position: fixed;
			top: 52px !important;
		}

		.o-tooltip--arrow-left.sticky {
			position: fixed;
			top: 4px !important;
		}


		@media(max-width: 489px) {
			.disclaimer__box {
				top:48px;
				left:0;
			}

			.disclaimer .o-tooltip {
				margin: 0 10px;
			}
		}
		
		@media(min-width: 490px) and (max-width: 739px) {
		    .disclaimer__box {
          top:52px;
          left:0;
        }
		}
		@media(min-width: 740px) and (max-width: 979px) {
		    .disclaimer__box {
          top:88px;
          left:0;
        }
		}
	</style>`;

const headerSnippet = `
    <header class="o-header" data-o-component="o-header" data-o-header--no-js="">
	<div class="o-header__row o-header__top">
		<div class="o-header__container">
			<div class="o-header__top-wrapper">
				<section class="disclaimer" id="disclaimer">
					<div class="disclaimer__box" id="paid-post-tooltip-target">
						<span class="disclaimer__paid-post">Paid Post</span>
						<span class="disclaimer__sponsor">[[REPLACED FROM META TAG WITH name="tooltip:sponsor" in uploaded page]]</span>
						<span class="disclaimer__info">i</span>
					</div>
				</section>
				<div id="paid-post-tooltip" data-o-component="o-tooltip"
					 data-o-tooltip-position="right"
					 data-o-tooltip-target="paid-post-tooltip-target"
					 data-o-tooltip-show-on-construction="true"
					 data-o-tooltip-close-after="5"
					 data-o-tooltip-toggle-on-click="true">
					<div class="o-tooltip-content">
						<p>This page was produced by FT<sup>2</sup>, the advertising department of the Financial Times.  The news and editorial staff of the Financial Times had no role in its preparation.</p>
					</div>
				</div>
				<div class="o-header__top-column o-header__top-column--left">
					<a href="#o-header-drawer" class="o-header__top-link o-header__top-link--menu" aria-controls="o-header-drawer">
						<span class="o-header__top-link-label">Menu</span>
					</a>
				</div>
				<div class="o-header__top-column o-header__top-column--center">
					<a class="o-header__top-logo" href="/" title="Go to Financial Times homepage">
						<span class="o-header__visually-hidden">Financial Times</span>
					</a>
				</div>
				<div class="o-header__top-column o-header__top-column--right"></div>

			</div>
		</div>
	</div>`;

const footer = `<footer class="o-footer o-footer--theme-dark" data-o-component="o-footer" data-o-footer--no-js="">
	<div class="o-footer__container">

		<div class="o-footer__copyright" role="contentinfo">
			<small>
				<abbr title="Financial Times" aria-label="F T">FT</abbr> and &#x2018;Financial Times&#x2019; are trademarks of The Financial Times Ltd.<br>
				The Financial Times and its journalism are subject to a self-regulation regime under the <a href="http://www.ft.com/editorialcode" aria-label="F T Editorial Code of Practice">FT Editorial Code of Practice</a>.
			</small>
		</div>

	</div>
	<div class="o-footer__brand">
		<div class="o-footer__container">
			<div class="o-footer__brand-logo"></div>
		</div>
	</div>
</footer>`;

const footScripts = (origamiScriptUrl) => `<script id="ft-js">
	/* FT Analytics */
	(function(src) {
		function throttle(func, wait) {
			let last, timer;

			return function() {
				const now = +new Date;
				const args = arguments;
				const context = this;

				if(last && now < last + wait) {
					clearTimeout(timer);
					timer = setTimeout(function() {
						last = now;
						func.apply(context, args);
					}, wait);
				}
				else {
					last = now;
					func.apply(context, args);
				}
			}
		}

		function stickyOnScroll() {
			// Sticky ads
			var adTargetEl = document.getElementById('paid-post-tooltip-target');
			var adContentEl = document.getElementById('paid-post-tooltip');
			var headerEl = document.getElementsByClassName('o-header')[0];
			var adPosTop = headerEl.getBoundingClientRect().height;
			var closeEl = document.getElementsByClassName('o-tooltip-close')[0];
			function closeTooltip() {
				closeEl.dispatchEvent(new Event('click', {"bubbles":true }));
			}

			window.addEventListener('scroll', throttle(closeTooltip, 150));
			window.addEventListener('scroll', function() {
				var lastScrollPos = window.scrollY;
				if(lastScrollPos > adPosTop) {
					adTargetEl.classList.add('sticky');
					adContentEl.classList.add('sticky');
				} else {
					adTargetEl.classList.remove('sticky');
					adContentEl.classList.remove('sticky');
				}
			});
		}
		
		// Need to make some changes to the DOM before initialising the
    // origami components so we fire off the o.DOMContentLoaded when
    // we're ready.
    document.addEventListener('DOMContentLoaded', function() {
      if(window.innerWidth < 740) {
        document.getElementById('paid-post-tooltip').setAttribute('data-o-tooltip-position', 'below');
      }
    });

		if (cutsTheMustard) {
			var o = document.createElement('script');
			o.async = o.defer = true;
			o.src = src;
			o.id = "origami-js";
			var s = document.getElementsByTagName('script')[0];
			if (o.hasOwnProperty('onreadystatechange')) {
				o.onreadystatechange = function() {
					if (o.readyState === "loaded") {
						document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
						stickyOnScroll();
					}
				};
			} else {
				o.onload = function() {
					document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
					stickyOnScroll();
				}
			}
			s.parentNode.insertBefore(o, s);
		}
		
		// The mustard is NOT cut
		else {
		  // Add fallback if browsers don't cut the mustard -->
		  var img = new Image();
			img.src = 'https://spoor-api.ft.com/px.gif?data=%7B%22category%22:%22page%22,%20%22action%22:%22view%22,%20%22system%22:%7B%22apiKey%22:%22qUb9maKfKbtpRsdp0p2J7uWxRPGJEP%22,%22source%22:%22o-tracking%22,%22version%22:%221.0.0%22%7D,%22context%22:%7B%22product%22:%22paid-post%22,%22content%22:%7B%22asset_type%22:%22page%22%7D%7D%7D';
		}
	}("${origamiScriptUrl}"));
</script>
<noscript>
	<img src="https://spoor-api.ft.com/px.gif?data=%7B%22category%22:%22page%22,%20%22action%22:%22view%22,%20%22system%22:%7B%22apiKey%22:%22qUb9maKfKbtpRsdp0p2J7uWxRPGJEP%22,%22source%22:%22o-tracking%22,%22version%22:%221.0.0%22%7D,%22context%22:%7B%22product%22:%22paid-post%22,%22content%22:%7B%22asset_type%22:%22page%22%7D%7D%7D"/>
</noscript>`;

function getNavHtml(navItems) {
  let navHtml = `
  <div class="o-header__drawer" id="o-header-drawer" data-o-header-drawer="" data-o-header-drawer--no-js="">
    <div class="o-header__drawer-inner">

    <div class="o-header__drawer-tools">
        <a class="o-header__drawer-tools-logo" href="https://www.ft.com/">
            <span class="o-header__visually-hidden">Financial Times</span>
        </a>
        <button type="button" class="o-header__drawer-tools-close" aria-controls="o-header-drawer">
            <span class="o-header__visually-hidden">Close</span>
        </button>
    </div>

    <nav class="o-header__drawer-menu o-header__drawer-menu--primary" role="navigation" aria-label="Primary navigation">

        <ul class="o-header__drawer-menu-list">`;
  navItems.forEach(navItem => {
    navHtml += `<li class="o-header__drawer-menu-item ">
                <a class="o-header__drawer-menu-link" href="https://next.ft.com${navItem.item.href}">${navItem.item.name}</a>
            </li>`;
  });

  navHtml += `</ul></nav></div></div>`;

  return navHtml;
}

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
  const oModules = oScript.attr('src').match(/o-([^&]+)/);
  if(oModules.length) {
    return _formatModules(oModules[0].split(','));
  }
  return null;
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

module.exports = $ => {
  const navData = getNavData();
  return navData.then(data => {
    $('head').prepend(headSnippet);
    $('body').prepend(headerSnippet);
    $('body').append(footer);
    $('body').append(getNavHtml(data));
    $('body').append(footScripts(getOrigamiUrl($, 'js')));
    replaceTooltipSponsor($);

    return $;
  });
};
