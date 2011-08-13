(function($, location, document, exports) {
  
  var view, router, model;
  
  // modernizr history test
  var historyAble = !!(window.history && history.pushState);
  
  (function() {
    // previous link support: https://github.com/mklabs/h5bp-docs/pull/5
    // doing it here to trigger this on non pushState able browsers too
    // we now prevent non pushState browsers from running the Backbone app
    // cause it may become tricky to deal with multiple location and so on 
    // (/docs/ vs /docs/The-style/)
    
    var text = location.hash.replace(/^#/,'');
    
    // if no hash in url, does nothing
    if(!text) return;
    
    var links = $('.wikiconvertor-pages a');
        
    // custom selector may be handy?
    // iterate through links and try to get a case unsensitive test with hash value
    var navlink = links.filter('a[href^="/docs/'+ text + '"]').map(function() {
      return !!this.href.match(new RegExp(text, 'i')) ? $(this).attr('href') : undefined;
    });
    
    // if navlink has elements, redirect to the first one
    if(navlink.length) location.href = navlink[0]; 
    
  })();
  
  // no backbone for non push state :(
  if(!historyAble) return;
  
  
  
  var DocsPage = Backbone.Model.extend({
    
    sync: function(options) {
      $.ajax($.extend(options, {
        dataType: 'html',
        url: this.url(),
        success: function(res) {
          model.set({content: $(res).find('.wikiconvertor-content').html()});
          view.render();
          
          // notify disqus of the asycn page change
          window.DISQUS && DISQUS.reset({
            reload: true,
            config: function () {  
              this.page.identifier = this.page.url = window.location.pathname;
            }
          });
        }
      }));
      
      return this;
    },
    
    url: function url() {
      var path = this.get('path');
      return (/^\//.test(path) ? '' : '/') + this.get('path');
    }
  });
  
  var DocsView = Backbone.View.extend({
    el: '#body',
    
    events: {
      'click .wikiconvertor-pages a': 'clickHandler'
    },
    
    initialize: function() {
      
      _.bindAll(this, 'clickHandler', 'addHdrAttr', 'addPermalinks');
      
      this.placeholder = this.$('.wikiconvertor-content');
      this.scroller = this.options.scroll ? $('html,body') : undefined;
      this.active = this.$('.wikiconvertor-pages a[href="' + model.url() + '"]');
      this.active.closest('li').addClass('wikiconvertor-pages-active');
      
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
      hdr = this.placeholder.find(':header'), h;

      // First thing first deal with headings and add proper data-wiki-hdr attribute
      hdr
        .each(this.addHdrAttr)
        .each(this.addPermalinks);

      if(!t || !hdr.length) {
        return;
      }

      h = hdr.filter('#' + t);

      if(!h.length) {
        // t = t.split(/#|â˜…/);
        // 
        // var navlinks = $('.wikiconvertor-pages a').filter('a[href^="/docs/'+ t[0] + '"]');
        // if ( navlinks.length ) location.href = navlinks[0].href + (t[1] ? '#' + t[1] : '');
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
      

      var title = path.match(/\/docs\/([^\/]+)\//);
      if(title && title[1]) {
        document.title = document.title.replace(/[^|]+|/, title[1] + ' '); 
      }
      
      model
        .set({ path: path })
        .fetch();
    }
  });
  
  $(function() {
    // TODO:DEBUG:REMOVE global exports
    model = new DocsPage({path: location.pathname });
    view = new DocsView({model: model, scroll: true});
    router = new DocsRouter();
    
    Backbone.history.start({ 
      pushState: true,
      root: '/docs/'
    });
  });
  
  
})(this.jQuery, this.location, this.document, this);