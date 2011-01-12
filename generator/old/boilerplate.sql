-- phpMyAdmin SQL Dump
-- version 3.3.8.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 10, 2011 at 10:03 PM
-- Server version: 5.0.91
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `htmlify_boilerplate`
--

-- --------------------------------------------------------

--
-- Table structure for table `boilerplate`
--

CREATE TABLE IF NOT EXISTS `boilerplate` (
  `id` int(255) NOT NULL auto_increment,
  `attribute` varchar(255) NOT NULL,
  `code` longtext NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `boilerplate`
--

INSERT INTO `boilerplate` (`id`, `attribute`, `code`) VALUES
(3, 'ie7', '<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->'),
(2, 'ie6', '<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->'),
(4, 'ie8', '<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->'),
(5, 'iere', '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'),
(6, 'viewport', '<meta name="viewport" content="width=device-width, initial-scale=1.0">'),
(7, 'apple_touch_icon', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\r\n'),
(8, 'mobile_stylesheet', '<link rel="stylesheet" media="handheld" href="css/handheld.css?v=2">'),
(9, 'jquery', '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.js"></script>\r\n<script>!window.jQuery && document.write(unescape(''%3Cscript src="js/libs/jquery-1.4.4.min.js"%3E%3C/script%3E''))</script>\r\n'),
(10, 'separate_script_files', '<!-- scripts concatenated and minified via ant build script-->\r\n<script src="js/plugins.js"></script>\r\n<script src="js/script.js"></script>\r\n<!-- end concatenated and minified scripts-->\r\n'),
(11, 'ie_trans', '<!--[if lt IE 7 ]>\r\n<script src="js/libs/dd_belatedpng.js"></script>\r\n<script> DD_belatedPNG.fix(''img, .png_bg''); </script>\r\n<![endif]-->\r\n'),
(12, 'yui', '<!-- yui profiler and profileviewer - remove for production -->\r\n<script src="js/profiling/yahoo-profiling.min.js"></script>\r\n<script src="js/profiling/config.js"></script>\r\n<!-- end profiling code -->\r\n'),
(13, 'google_track', '<!-- change the UA-XXXXX-X to be your site''s ID -->\r\n  <script>\r\n   var _gaq = [[''_setAccount'', ''UA-XXXXX-X''], [''_trackPageview'']];\r\n   (function(d, t) {\r\n    var g = d.createElement(t),\r\n        s = d.getElementsByTagName(t)[0];\r\n    g.async = true;\r\n    g.src = (''https:'' == location.protocol ? ''https://ssl'' : ''http://www'') + ''.google-analytics.com/ga.js'';\r\n    s.parentNode.insertBefore(g, s);\r\n   })(document, ''script'');\r\n  </script>\r\n'),
(14, 'doctype', '<!doctype html>  '),
(15, 'head_start', '<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->\r\n<head>\r\n<meta charset="utf-8">'),
(16, 'title', '<title></title>\r\n<meta name="description" content="">\r\n<meta name="author" content="">'),
(17, 'favicon', '<link rel="shortcut icon" href="/favicon.ico">'),
(18, 'main_css', '<link rel="stylesheet" href="css/style.css?v=2">'),
(19, 'modernizr', '<script src="js/libs/modernizr-1.6.min.js"></script>\r\n'),
(20, 'main_body', '</head>\r\n\r\n<body>\r\n\r\n  <div id="container">\r\n    <header>\r\n\r\n    </header>\r\n    \r\n    <div id="main">\r\n\r\n    </div>\r\n    \r\n    <footer>\r\n\r\n    </footer>\r\n  </div> <!-- end of #container -->\r\n'),
(21, 'end_body', '</body>\r\n</html>'),
(22, 'Css_reset', '\r\nhtml, body, div, span, object, iframe,\r\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\r\nabbr, address, cite, code,\r\ndel, dfn, em, img, ins, kbd, q, samp,\r\nsmall, strong, sub, sup, var,\r\nb, i,\r\ndl, dt, dd, ol, ul, li,\r\nfieldset, form, label, legend,\r\ntable, caption, tbody, tfoot, thead, tr, th, td,\r\narticle, aside, canvas, details, figcaption, figure,\r\nfooter, header, hgroup, menu, nav, section, summary,\r\ntime, mark, audio, video {\r\n  margin:0;\r\n  padding:0;\r\n  border:0;\r\n  outline:0;\r\n  font-size:100%;\r\n  font: inherit;\r\n  vertical-align:baseline;\r\n}\r\n\r\narticle, aside, details, figcaption, figure,\r\nfooter, header, hgroup, menu, nav, section {\r\n    display:block;\r\n}\r\n\r\nnav ul { list-style:none; }\r\n\r\nblockquote, q { quotes:none; }\r\n\r\nblockquote:before, blockquote:after,\r\nq:before, q:after { content:''''; content:none; }\r\n\r\na { margin:0; padding:0; font-size:100%; vertical-align:baseline; background:transparent; }\r\n\r\nins { background-color:#ff9; color:#000; text-decoration:none; }\r\n\r\nmark { background-color:#ff9; color:#000; font-style:italic; font-weight:bold; }\r\n\r\ndel { text-decoration: line-through; }\r\n\r\nabbr[title], dfn[title] { border-bottom:1px dotted; cursor:help; }\r\n\r\ntable { border-collapse:collapse; border-spacing:0; }\r\n\r\nhr { display:block; height:1px; border:0; border-top:1px solid #ccc; margin:1em 0; padding:0; }\r\n\r\ninput, select { vertical-align:middle; }'),
(23, 'font', 'body { font:13px/1.231 sans-serif; *font-size:small; } /* hack retained to preserve specificity */\r\n\r\nselect, input, textarea, button { font:99% sans-serif; }\r\n\r\n/* normalize monospace sizing\r\n * en.wikipedia.org/wiki/MediaWiki_talk:Common.css/Archive_11#Teletype_style_fix_for_Chrome\r\n */\r\npre, code, kbd, samp { font-family: monospace, sans-serif; }\r\n'),
(24, 'base_styles', 'body, select, input, textarea {\r\n  /* #444 looks better than black: twitter.com/H_FJ/statuses/11800719859 */\r\n  color: #444;\r\n  /* set your base font here, to apply evenly */\r\n  /* font-family: Georgia, serif;  */\r\n}\r\n\r\n/* headers (h1,h2,etc) have no default font-size or margin,\r\n   you''ll want to define those yourself. */\r\nh1,h2,h3,h4,h5,h6 { font-weight: bold; }\r\n\r\n/* always force a scrollbar in non-IE: */\r\nhtml { overflow-y: scroll; }\r\n\r\n\r\n/* accessible focus treatment: people.opera.com/patrickl/experiments/keyboard/test */\r\na:hover, a:active { outline: none; }\r\n\r\na, a:active, a:visited { color: #607890; }\r\na:hover { color: #036; }\r\n\r\n\r\nul, ol { margin-left: 2em; }\r\nol { list-style-type: decimal; }\r\n\r\n/* remove margins for navigation lists */\r\nnav ul, nav li { margin: 0; }\r\n\r\nsmall { font-size: 85%; }\r\nstrong, th { font-weight: bold; }\r\n\r\ntd { vertical-align: top; }\r\n\r\n/* set sub, sup without affecting line-height: gist.github.com/413930*/\r\nsub, sup { font-size: 75%; line-height: 0; position: relative; }\r\nsup { top: -0.5em; }\r\nsub { bottom: -0.25em; }\r\n\r\npre {\r\n  /* www.pathf.com/blogs/2008/05/formatting-quoted-code-in-blog-posts-css21-white-space-pre-wrap/ */\r\n  white-space: pre; white-space: pre-wrap; white-space: pre-line; word-wrap: break-word;\r\n  padding: 15px;\r\n}\r\n\r\ntextarea { overflow: auto; } /* www.sitepoint.com/blogs/2010/08/20/ie-remove-textarea-scrollbars/ */\r\n\r\n.ie6 legend, .ie7 legend { margin-left: -7px; } /* thnx ivannikolic! */\r\n\r\n/* align checkboxes, radios, text inputs with their label by: Thierry Koblentz tjkdesign.com/ez-css/css/base.css  */\r\ninput[type="radio"] { vertical-align: text-bottom; }\r\ninput[type="checkbox"] { vertical-align: bottom; }\r\n.ie7 input[type="checkbox"] { vertical-align: baseline; }\r\n.ie6 input { vertical-align: text-bottom; }\r\n\r\n/* hand cursor on clickable input elements */\r\nlabel, input[type="button"], input[type="submit"], input[type="image"], button { cursor: pointer; }\r\n\r\n/* webkit browsers add a 2px margin outside the chrome of form elements */\r\nbutton, input, select, textarea { margin: 0; }\r\n\r\n/* colors for form validity */\r\ninput:valid, textarea:valid   {  }\r\ninput:invalid, textarea:invalid {\r\n      border-radius: 1px;\r\n    -moz-box-shadow: 0px 0px 5px red;\r\n -webkit-box-shadow: 0px 0px 5px red;\r\n         box-shadow: 0px 0px 5px red;\r\n}\r\n.no-boxshadow input:invalid,\r\n.no-boxshadow textarea:invalid { background-color: #f0dddd; }\r\n\r\n\r\n/* These selection declarations have to be separate.\r\n   No text-shadow: twitter.com/miketaylr/status/12228805301\r\n   Also: hot pink. */\r\n::-moz-selection{ background: #FF5E99; color:#fff; text-shadow: none; }\r\n::selection { background:#FF5E99; color:#fff; text-shadow: none; }\r\n\r\n/*  j.mp/webkit-tap-highlight-color */\r\na:link { -webkit-tap-highlight-color: #FF5E99; }\r\n\r\n/* make buttons play nice in IE:\r\n   www.viget.com/inspire/styling-the-button-element-in-internet-explorer/ */\r\nbutton {  width: auto; overflow: visible; }\r\n\r\n/* bicubic resizing for non-native sized IMG:\r\n   code.flickr.com/blog/2008/11/12/on-ui-quality-the-little-things-client-side-image-resizing/ */\r\n.ie7 img { -ms-interpolation-mode: bicubic; }'),
(25, 'nonsem', '/* for image replacement */\r\n.ir { display: block; text-indent: -999em; overflow: hidden; background-repeat: no-repeat; text-align: left; direction: ltr; }\r\n\r\n/* Hide for both screenreaders and browsers\r\n   css-discuss.incutio.com/wiki/Screenreader_Visibility */\r\n.hidden { display: none; visibility: hidden; }\r\n\r\n/* Hide only visually, but have it available for screenreaders: by Jon Neal\r\n  www.webaim.org/techniques/css/invisiblecontent/  &  j.mp/visuallyhidden */\r\n.visuallyhidden {\r\n    border: 0 !important;\r\n    clip: rect(0 0 0 0);\r\n    height: 1px !important;\r\n    margin: -1px !important;\r\n    overflow: hidden !important;\r\n    padding: 0 !important;\r\n    position: absolute !important;\r\n    width: 1px !important;\r\n}\r\n\r\n/* Hide visually and from screenreaders, but maintain layout */\r\n.invisible { visibility: hidden; }\r\n\r\n/* >> The Magnificent CLEARFIX: Updated to prevent margin-collapsing on child elements << j.mp/bestclearfix */\r\n.clearfix:before, .clearfix:after { content: "\\0020"; display: block; height: 0; visibility: hidden; }\r\n.clearfix:after { clear: both; }\r\n/* fix clearfix: blueprintcss.lighthouseapp.com/projects/15318/tickets/5-extra-margin-padding-bottom-of-page */\r\n.clearfix { zoom: 1; }\r\n'),
(26, 'primarystyles', ' /* Primary Styles\r\n    Author:\r\n */'),
(27, 'mediaQuery', '@media all and (orientation:portrait) {\r\n  /* style adjustments for portrait mode goes here */\r\n\r\n}\r\n\r\n@media all and (orientation:landscape) {\r\n  /* style adjustments for landscape mode goes here */\r\n\r\n}\r\n\r\n/* Grade-A Mobile Browsers (Opera Mobile, Mobile Safari, Android Chrome)\r\n   consider this: www.cloudfour.com/css-media-query-for-mobile-is-fools-gold/ */\r\n@media screen and (max-device-width: 480px) {\r\n\r\n\r\n  /* uncomment if you don''t want iOS and WinMobile to mobile-optimize the text for you\r\n     j.mp/textsizeadjust\r\n  html { -webkit-text-size-adjust:none; -ms-text-size-adjust:none; } */\r\n}'),
(28, 'printstyles', '@media print {\r\n  * { background: transparent !important; color: black !important; text-shadow: none !important; filter:none !important;\r\n  -ms-filter: none !important; } /* black prints faster: sanbeiji.com/archives/953 */\r\n  a, a:visited { color: #444 !important; text-decoration: underline; }\r\n  a[href]:after { content: " (" attr(href) ")"; }\r\n  abbr[title]:after { content: " (" attr(title) ")"; }\r\n  .ir a:after, a[href^="javascript:"]:after, a[href^="#"]:after { content: ""; }  /* don''t show links for images, or javascript/internal links */\r\n  pre, blockquote { border: 1px solid #999; page-break-inside: avoid; }\r\n  thead { display: table-header-group; } /* css-discuss.incutio.com/wiki/Printing_Tables */\r\n  tr, img { page-break-inside: avoid; }\r\n  @page { margin: 0.5cm; }\r\n  p, h2, h3 { orphans: 3; widows: 3; }\r\n  h2, h3{ page-break-after: avoid; }\r\n}');
