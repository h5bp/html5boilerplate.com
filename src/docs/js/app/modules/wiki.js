/**
* Probably the most important module in our application.
*
* It deals with most of user interraction, showdown conversion (markdown to html), data retrieval 
* (via the use of the markdown service), the generation of the menu pane (depending on files options variable in config.js),
* most of DOM manipulation is done there (and probably should be restricted to this module).
*
* It subscribes itself to the folowing topics: 
*  - wiki-history-change (provided by the history module) to handle the update of the UI (and possibly the data retrieval)
*  - wiki-file-error (provided by the markdown service and this module itself) to deal with 404(kind of) state. Yeah, I love Mr Frown.
* 
* While publishing:
*  - wiki-new-file (mostly for the highlight module which needs to be notified anytime a new file is displayed)
*  - wiki-file-error (to deal with error state in xhr and 404(kind of) state)
*
*
* This module only performs tasks in the scope of its concerns (at least it tries to), any xhr communication is provided bu the 
* markdown service. It subscribes itself and publish some interresting topics that other modules can listen or fired.
*/
 (function($, global) {

    define(

    // Dependencies
    ['config', 'app/services/markdown', 'app/modules/base', 'libs/showdown', 'libs/pubsub'],

    // Entry Point
    function(config, service, base, Showdown) {

        var convertor = new Showdown.converter(),

        files = config.files,

        inArray = function(elem, array) {
            elem = elem.toLowerCase();
            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i].toLowerCase() === elem) {
                    return i;
                }
            }

            return - 1;
        },
        
        
        module = $.extend({}, base, Object.create((function() {

          var pageItemTmpl = '<li><a href="${url}">${text}</a></li>', 

          eventify = function() {
            var self = this;

            this.element.delegate('a', 'click', $.proxy(clickHandler, this));
            $.subscribe('wiki-history-change', $.proxy(popHandler, this));
            $.subscribe('wiki-file-error', $.proxy(this.error, this));
            $.subscribe('wiki-new-file', $.proxy(this.updateMenu, this));
          },

          clickHandler = function(ev) {
            var href = $(ev.target).attr('href'),
            external = /\/\//.test(href);

            if(!external) {
              this.fetchData(href + (/\.md/.test(href) ? "" : ".md"));
              return false; 
            }
          },

          popHandler = function(file) {
            this.fetchData(file);
          },
          
          resolveFile = function() {
            var s = this.element.attr('data-file') || global.location.href.split('#')[1] || service.base; 
            return s;
          },

          getFileHash = function(file) {
            return global.location.hash;
          },

          createPagePanes = function() {
            var pane = this.element.find('.wikiconvertor-pages'),
            holder = $('<ul />').appendTo(pane),
            tmp = "";

            $.each(files, function(i, file){
              tmp += pageItemTmpl.replace(/\${url}/, '#' + file).replace(/\${text}/, file.replace(/.md/, ''));
            });

            holder.append(tmp);
            
            return pane;
          },
          
          escapeWikiAnchors = function(text) {
            text = text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, function(wholeMatch, m1, m2) {
              return "["+m1+"](" + m2 + ")";
            });
            
            text = text.replace(/\[\[([^\]]+)\]\]/g, function(wholeMatch, m1) {
              return "["+m1+"](#" + m1.split(' ').join('-') + ")";
            });
            
            return text;
          };

          return {
            options: {
              main: '#main',
              header: '#header',
              footer: '#footer'
            },
            init: function(options, elem){
              var self = this, o = this.options;

              this.main = this.element.find(this.options.main).addClass('wikistyle');
              this.header = this.element.find(this.options.header);
              this.footer = this.element.find(this.options.footer);
              this.file = resolveFile.apply(this);
              this.pages = createPagePanes.apply(this);
              
              service.init({wiki: this.options.wikiPath});

              eventify.apply(this);

              this.fetchData(this.file);
            },
            
            updateMenu: function(file) {
              var s = 'wikiconvertor-pages-active';
              
              this.pages.find('li')
                .removeClass(s);
                
              this.pages.find('[href="#' + file + '"]')
                .closest('li')
                .addClass(s);
            },

            error: function(){

              this.main.empty()
                .append($('<h1 />', {
                  text: 'Not Found'
                }))
                .append($('<p />', {'class': 'wikiconvertor-error'}).append($('<span />', {
                  'class': 'frown insolent',
                  text: ':('
                })));

            },

            fetchData: function(file, ignoreAnchor) {
              var pos = inArray(file.replace('#', ''), files);

              file = (this.file = pos !== -1 ? files[pos] : "");

              if(file === "") {
                $.publish('wiki-file-error', [file]);
                return this.error();
              }
              
              // Well, if the anchor is the originaly one (most likely a refresh), popState won't happen
              if(file === global.location.hash.replace('#', '')) {
                service.get(file.replace(/#/, ''), $.proxy(this.render, this)); 
              } else {
                this.updateAnchor(file);                
              }
            },

            updateTitle: function() {
              var file = this.file.replace(/.md/, '').replace(/-/g, ' '),
              star = '<span>&#x2605;</span>',
              link = '<a href="{url}">Edit this page</a>'
                .replace(/{url}/, config.wikiUrl + this.file.replace(/\.md/, '/_edit'));
                
              this.header.find('h2')
                .html([file, star].join(' '))
                .append(link);
            },

            render: function(response){
              var md = convertor.makeHtml(escapeWikiAnchors.call(this, response)),
              html = $(md),
              title = html.eq(0).is('h1') ? html.eq(0).html() : "";
              
              this.main.html(md.replace(/<h1>[\w|\s|<|>|(|)|\/]+<\/h1>/, ''));

              this.updateTitle();

              // Notify the apps that a new file is available
              $.publish('wiki-new-file', [this.file]);
            },

            updateAnchor: function(file){
              if(!file) {
                return;
              }
              
              global.location.href = '#' + file;
            }
          };
          // Auto-executing function
        })()));
        
        $.bridge('wikiConvertor', module);
        
        return module;
        
    });

})(this.jQuery, this);