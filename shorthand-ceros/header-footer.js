module.exports = ($, args) => {
  if (args.uuid) {

const headSnippet = `
<meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">

   <title>[[ REPLACE WITH YOUR TITLE]]</title>
   <link rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-grid@^4.2.0,o-header@^6.3.0,o-footer@^5.0.1,o-typography@^4.3.0,o-colors@^3.4.1" />
 <script>
   var cutsTheMustard = ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window);
   if (cutsTheMustard) {
       // Swap the 'core' class on the HTML element for an 'enhanced' one
       // We're doing it early in the head to avoid a flash of unstyled content
       document.documentElement.className = document.documentElement.className.replace(/\bcore\b/g, 'enhanced');
       }
</script>
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

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
     width: 100%;
     border-bottom: 3px solid #09a25c;
     background-color: #DADADA;
     font-family: MetricWeb,sans-serif;
     font-size: 13px;
   }
   .disclaimer__left {
     align-self: center;
     -ms-flex-item-align: center;
     margin-top: -2%;
   }
   .disclaimer__paid_post {
     display: block;
     text-indent: -9999px;
     overflow: hidden;
     width: 45px;
     height: 45px;
     background-repeat: no-repeat;
     background-image: url(data:image/png;base64,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);
     float:left
   }
   .disclaimer__sponsor-text {
     display: inline;
     position: relative;
     top: 5px;
   }
   .disclaimer__sponsor {
     position: relative;
   }
   .disclaimer__sponsor-wide {
     display: none;
   }
   @media(min-width: 740px) {
     .disclaimer__left {
       margin-top: 0px;
     }
     .disclaimer__paid_post {
       display: inline;
     }
     .disclaimer__sponsor {
       display: none;
     }
     .disclaimer__sponsor-wide {
       display: block;
       position: relative;
       left: 5px;
       top: 30px;
     }
     .disclaimer__sponsor-text {
       display: inline;
       position: relative;
       left: -1%;
       top: 1%;
     }
   }
   </style>

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
 <![endif]-->`;


const headerSnipppet = `<header class="o-header" data-o-component="o-header" data-o-header--no-js="">

	<div class="o-header__row o-header__top">
		<div class="o-header__container">
			<div class="o-header__top-wrapper">
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
`;


$('head').append(headSnippet);
$('body').append(headerSnippet);
}
  return $;
};
