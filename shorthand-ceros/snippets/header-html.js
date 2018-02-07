'use strict';

module.exports = `
<header class="o-header" data-o-component="o-header" data-o-header--no-js="">
	<div class="o-header__row o-header__top">
		<div class="o-header__container">
			<div class="o-header__top-wrapper">
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
	</div>
</header>
<div class="o-grid-container disclaimer">
  <div class="disclaimer__box" id="paid-post-tooltip-target">
    <span class="disclaimer__paid-post">Paid Post</span>
    <span class="disclaimer__sponsor">[[REPLACED FROM META TAG WITH name="tooltip:sponsor" in uploaded page]]</span>
    <span class="disclaimer__info">i</span>
  </div>
</div>`;