/**
* This module allows the tracking of page transition within the docs app.
*
* It basically subscribes itself to the following topic:
*   - wiki-new-file
*   - wiki-history-change
* 
* Once the module is initialized, the ga tracker is set up.
*
* On each page transition (wiki-history-change event), a new call is made trackPageview with the hash value.
*   http://www.google.com/support/forum/p/Google%20Analytics/thread?tid=350b101678492c55&hl=en
*   _gaq.push(['_trackPageview', '/funnel_G1/step1.html']);
*
*/
(function($, global, undefined){
  
  define(['app/modules/base', 'libs/pubsub'], function(base) {
    
    var module = $.extend({}, base, Object.create({
      options: {
        uid: 'UA-XXXXX-X'
      },

      init: function(options, elem) {
        global._gaq = [['_setAccount', this.options.uid],['_trackPageview']];
        
        // mathiasbynens.be/notes/async-analytics-snippet
        (function(d,t) {
          var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
          g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
          s.parentNode.insertBefore(g,s)
        }(document,'script'));
        
        $.subscribe('wiki-new-file', $.proxy(this.ping, this));
      },

      ping: function(id) {
        global._gaq.push(['_trackPageview', '/docs/#' + id]);
      }
    }));

    $.bridge('ga', module);

    return module;

  });

})(this.jQuery, this);