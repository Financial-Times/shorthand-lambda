'use strict';

module.exports = (origamiCssUrl) => `
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${origamiCssUrl}" />
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

		.disclaimer__box {
			position: absolute;
			top: 0;
			display: block;
			padding: 10px;
			background-color: white;
			font-family: MetricWeb, sans-serif;
			font-size: 13px;
			border: 1px solid #DADADA;
			cursor: pointer;
			z-index: 98;
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
		  font-family: MetricWeb, sans-serif;
			margin-right: 50px;
			padding-top: 10px;
			padding-bottom: 10px;
		}

		.disclaimer .o-tooltip-content p {
			font-size: 16px;
		}

		.o-tooltip--arrow-above.sticky {
			position: fixed;
			top: 52px !important;
		}

		.o-tooltip--arrow-left.sticky {
			position: fixed;
			top: 4px !important;
		}
	</style>`;
