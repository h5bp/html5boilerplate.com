(function($, location, document, exports) {

  var view, router, model,

  loadComments = function(path, offset) {
    // clean things
    $('link').filter('[href*="disqus"]').remove();
    $('script').filter('[src*="disqus"]').remove();

    // change a few disqus variable before loading in
    exports.disqus_identifier = path;
    exports.disqus_url= path;
    exports.disqus_title = 'h5bp docs comment for ' + path;

    (function() {
      var dsq = document.createElement('script');
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.head || document.getElementsByTagName('head')[0] || document.body).appendChild(dsq);
    })();
  };

  // modernizr history test
  var historyAble = !!(window.history && history.pushState);

  (function() {
    // doing it here to trigger this on non pushState able browsers too
    // we now prevent non pushState browsers from running the Backbone app
    // cause it may become tricky to deal with multiple location and so on
    // (/docs/ vs /docs/The-style/)

    var text = location.hash.replace(/^#/,''),
      parts, heading;

    // if no hash in url, does nothing
    if(!text) return;

    var links = $('.wikiconvertor-pages a');

    // also make sure we support `#thiskind#ofurl`
    parts = text.split(/(#|%23)/);
    heading = parts[1] ? ('#' + parts[parts.length - 1]) : '';

    // iterate through links and try to get a case unsensitive test with hash value
    var navlink = links.map(function() {
      var m = this.href.match(new RegExp(parts[0], 'i'));
      return m ? $(this).attr('href') : undefined;
    });

    // if navlink has elements, redirect to the first one, only when we're
    // at `/docs/` or `/docs`
    if (navlink.length && /\/docs\/?$/.test(location.pathname)) location.href = navlink[0] + heading;

  })();

  // no backbone for non push state :(
  if(!historyAble) return;

  var DocsPage = Backbone.Model.extend({
    url: function url() {
      var path = this.get('path');
      return (/^\//.test(path) ? '' : '/') + this.get('path');
    },

    parse: function(resp, xhr) {
      var m = this.get('path').match(/docs\/([^\/]+)\//),
      title = m ? m[1].replace(/-/g, ' ') : 'Home';
      return {
        title: title,
        content: $(resp).find('.wikiconvertor-content').html()
      };
    },

    // provide a sync impl for our Page Model
    sync: function(method, model, options) {
      $.ajax($.extend(options, {
        dataType: 'html',
        url: this.url()
      }));
      return this;
    }

  });

  var DocsView = Backbone.View.extend({
    el: '#body',

    events: {
      'click .wikiconvertor-pages a': 'clickHandler'
    },

    initialize: function() {
      _.bindAll(this, 'clickHandler', 'addHdrAttr', 'addPermalinks');

      // re-render when model changes
      this.model.bind('change:content', _.bind(this.render, this));
      this.model.bind('change:title', _.bind(this.updateTitle, this));

      // few dom references
      this.placeholder = this.$('.wikiconvertor-content');
      this.nav = this.$('.wikiconvertor-pages');
      this.scroller = this.options.scroll ? $('html,body') : undefined;
      this.active = this.$('.wikiconvertor-pages a[href="' + model.url() + '"]');
      this.active.closest('li').addClass('wikiconvertor-pages-active');

      // build headings and permalinks
      this.headings();
    },

    clickHandler: function clickHandler(e) {
      var target = $(e.target),
      url = target.closest('a').attr('href'),
      external = /\/\//.test(url),
      octothorpe = /#/.test(url);

      e.preventDefault();

      if(!external && !octothorpe) {
         this.active.closest('li').removeClass('wikiconvertor-pages-active');
         this.active = target.closest('li').addClass('wikiconvertor-pages-active');

         if(this.scroller) {
           this.scroller.animate({scrollTop: 0}, 500);
         }

         router.navigate(url, true);
       }
    },

    headings: function headings(text) {
      // # or ...
      var t = text || location.hash.replace(/^#/,''),
        hdr = this.placeholder.find(':header'), 
        h;

      // First thing first deal with headings and add proper data-wiki-hdr attribute
      hdr
        .each(this.addHdrAttr)
        .each(this.addPermalinks);


      if(!t || !hdr.length) {
        return;
      }

      h = hdr.filter('#' + t);

      if(!h.length) {
        return;
      }

      this.scroller.animate({scrollTop: h.offset().top}, 0);
    },

    addPermalinks: function(i, header) {
      var t = $(header),
      hdr  = t.attr('id');
      $('<span class="octothorpe"><a href="' + '#' + hdr + '">#</a></span>').appendTo(t);
    },

    addHdrAttr: function(i, header) {
      var t = $(header),
      text = t.text(),
      attr = text
        // First lower case all
        .toLowerCase()

        // Then replace any special character
        .replace(/[^a-z|A-Z|\d|\s|\-]/g, '')

        // Finally, replace all blank space by - delimiter
        .replace(/\s/g, '-');

      t.attr('id', attr);
    },

    render: function render() {
      $(this.placeholder).html(this.model.get('content'));
      this.headings();
      return this;
    },

    updateTitle: function() {
      document.title = document.title.replace(/[^|]+|/, this.model.get('title') + ' ');
    }
  });

  var DocsRouter = Backbone.Router.extend({
    routes: {
      // catch all
      '*path': 'changePage'
    },

    changePage: function changePage(path) {
      if(!path || path === model.get('path')) {
        return;
      }

      model
        .set({ path: path })
        .fetch({
          success: function() {
            // users gets comments by scolling to the bottom section

            // the only exception is when the page content is too small for that, in that case
            // load immediately

            if( view.nav.height() - 750 > view.placeholder.height() ) {
              loadComments(path);
            }
          }
        });
    }
  });

  $(function() {

    var disqus_thread = $('#disqus_thread'),
    win = $(window),
    doc = $(document),

    atBottom = function(offset) {
      offset = offset || 750;
      return win.scrollTop() > (doc.height() - win.height() - offset);
    };


    // create our app components
    model = new DocsPage({path: location.pathname.replace(/^\//, '')});
    view = new DocsView({model: model, scroll: true});
    router = new DocsRouter();

    Backbone.history.start({
      pushState: true
    });

    // listen to scrolling so that we detect when the bottom is reached
    // where we trigger disqus comments
    win.scroll(function() {
      var dsq = $('#disqus_thread');

      if(!atBottom()) return;

      // ok, user is reaching the page bottom, load comments, but only if it wasn't done before.
      // assume es5 trim method is there, since non pushstate browser would normally
      // not reach this code
      var prevent = dsq.html().trim();
      if(prevent) return;

      loadComments(model.get('path'));
    });

  });

})(this.jQuery, this.location, this.document, this);

