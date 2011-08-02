/**
* This module defines special logic to apply related to disqus comments.
*
* It basically subscribes itself to the following topic:
*   - wiki-new-file -> call of initDisqus
*   - wiki-request-file -> call of clearDisqus
* 
* Options available are: 
*
* hooks:
*  dsqWrapper: '.disqus-wrapper',
*  dsqThread: '#disqus_thread',
*  dsqContent: 'a[href=#dsq-content]',
*  
* disqus variable:
*  dsqUrl: 'http://example.com/test/hashbang/article/{id}',
*  dsqShortname: 'h5bdocstest'
*
*/
(function($, global, undefined){
  define(['app/modules/base', 'libs/pubsub'], function(base) {
    var module = $.extend({}, base, Object.create({
      options: {
        dsqWrapper: '.disqus-wrapper',
        dsqThread: '#disqus_thread',
        dsqContent: 'a[href=#dsq-content]',

        dsqUrl: 'http://example.com/test/hashbang/article/{id}',
        dsqShortname: 'h5bdocstest'
      },

      init: function(options, elem) {
        this.content = this.element.find('.wikiconvertor-content');
        this.dsqWrapper = this.element.find(this.options.dsqWrapper);
        this.dsqThread = $('<div />', {id: 'disqus_thread'});
        this.dsqContent = this.element.find(this.options.dsqContent);

        $.subscribe('wiki-new-file', $.proxy(this.initDisqus, this));
        $.subscribe('wiki-history-change', $.proxy(this.clearDisqus, this));

        this.dsqContent.toggle(
          $.proxy(this.showComments, this), 
          $.proxy(this.hideComments, this)
        );
      },

      hideComments: function(e) {
        this.dsqContent.text('Show comments');

        this.element.find(this.options.dsqThread).hide();
      },

      showComments: function(e) {
        this.dsqContent.text('Hide comments');
        
        this.element.find(this.options.dsqThread).show();
        
        this.loadDisqus();
      },
      
      loadDisqus: function() {
        var dsq = document.createElement('script');
        
        this.dsqThread.clone().appendTo(this.dsqWrapper).show();
        
        dsq.type = 'text/javascript'; 
        dsq.async = true;
        dsq.src = 'http://' + this.disqus_shortname + '.disqus.com/embed.js';
        
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      },

      clearDisqus: function() {
        var searchFor = "disqus.com";

        $('iframe[src*="{0}"]'.replace(/\{0\}/, searchFor))
          .add('script[src*="{0}"]'.replace(/\{0\}/, searchFor))
          .add('link[href*="{0}"]'.replace(/\{0\}/, searchFor))
          .add('div.dsq-tooltip-outer')
          .remove();

        this.element.find(this.options.dsqThread).remove();
        
        this.hideComments();
      },

      initDisqus: function(id) {
        this.disqus_developer = global.disqus_developer = ( /file/.test(location.protocol) || /(localhost|dropbox)/.test(location.host) ) ? 1 : undefined,
        this.disqus_url = global.disqus_url = this.options.dsqUrl.replace('{id}', id),
        this.disqus_identifier = global.disqus_identifier = id,
        this.disqus_title = global.disqus_title = 'Thread for ' + id,
        this.disqus_shortname = this.options.dsqShortname;      
      }
    }));

    $.bridge('disqus', module);

    return module;

  });

})(this.jQuery, this);