'use strict';

module.exports = (origamiScriptUrl, trackingPageOptions) => `<script id="ft-js">
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

		function oTrackinginit() {
          // oTracking
          var oTracking = Origami['o-tracking'];
          var sponsor = document.querySelector('meta[name="sponsor"]');
          var parent = document.querySelector('meta[name="parent"]');
          var config_data = {
              server: 'https://spoor-api.ft.com/px.gif',
              context: {
                  product: 'paid-post',
                  content: {
                    title: document.querySelector('title').textContent,
                    parent: parent ? parent.getAttribute('content') : null,
                    sponsor: sponsor ? sponsor.getAttribute('content') : null
                  }
              },
              user: {
                  ft_session: oTracking.utils.getValueFromCookie(/FTSession=([^;]+)/)
              }
          }
          // Setup
		  oTracking.init(config_data);
		  // Automatically track clicks 
		  oTracking.click.init();
          // Page
          oTracking.page(${trackingPageOptions});
	  }
	  
	  function closeTooltip(closeEl) {
		  closeEl.dispatchEvent(new Event('click', {"bubbles":true }));
	  }

		function stickyOnScroll() {
			// Sticky ads
			var adTargetEl = document.getElementById('paid-post-tooltip-target');
			var adContentEl = document.getElementById('paid-post-tooltip');
			var headerEl = document.getElementsByClassName('o-header')[0];
			var adPosTop = headerEl.getBoundingClientRect().height;
			var closeEl = document.getElementsByClassName('o-tooltip-close')[0];
			closeTooltip(closeEl)

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
						oTrackinginit();
					}
				};
			} else {
				o.onload = function() {
					document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
					stickyOnScroll();
					oTrackinginit();
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
	})("${origamiScriptUrl}");
</script>
<noscript>
	<img src="https://spoor-api.ft.com/px.gif?data=%7B%22category%22:%22page%22,%20%22action%22:%22view%22,%20%22system%22:%7B%22apiKey%22:%22qUb9maKfKbtpRsdp0p2J7uWxRPGJEP%22,%22source%22:%22o-tracking%22,%22version%22:%221.0.0%22%7D,%22context%22:%7B%22product%22:%22paid-post%22,%22content%22:%7B%22asset_type%22:%22page%22%7D%7D%7D"/>
</noscript>`;
