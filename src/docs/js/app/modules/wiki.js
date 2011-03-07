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

            this.wiki.delegate('a', 'click', $.proxy(clickHandler, this));
            $.subscribe('wiki-history-change', $.proxy(popHandler, this));
            $.subscribe('wiki-file-error', $.proxy(this.error, this));
            $.subscribe('wiki-new-file', $.proxy(this.updateMenu, this));
          },

          clickHandler = function(ev) {
            var href = $(ev.target).attr('href'),
            external = /\/\//.test(href);

            if(!external) {
              this.fetchData(href.replace(/^#/, ''));
              return false; 
            }
          },

          popHandler = function(file) {
            this.fetchData(file.replace(/^#/, '').split(/#/)[0] || service.base);
          },
          
          resolveFile = function() {
            return this.element.attr('data-file') || 
              global.location.hash.replace(/^#/, '').split('#')[0] || 
              service.base; 
          },

          getFileHash = function(file) {
            return global.location.hash;
          },

          createPagePanes = function() {
            var pane = this.element.find('.wikiconvertor-pages'),
            holder = $('<ul />').appendTo(pane),
            tmp = "";

            $.each(files, function(i, file) {
              file = file.replace(/.md/, '');
              tmp += pageItemTmpl.replace(/\${url}/, '#' + file).replace(/\${text}/, file.replace(/-/g,' '));
            });

            holder.append(tmp);
            
            return pane;
          },
          
          escapeWikiAnchors = function(text) {
            text = text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, function(wholeMatch, m1, m2) {
              return "["+m1+"]("+ (!(/\/\//).test(m2) ? '#' : '') + m2 + ")";
            });
            
            text = text.replace(/\[\[([^\]]+)\]\]/g, function(wholeMatch, m1) {
              return "["+m1+"](#" + m1.split(' ').join('-') + ")";
            });
            
            return text;
          };

          return {
            options: {
              wiki: "#body",
              main: '#main',
              header: '#header',
              footer: '#footer'
            },
            init: function(options, elem){
              var self = this, o = this.options;
              
              this.header = this.element.find(this.options.header);
              this.wiki = this.element.find(this.options.wiki);
              this.main = this.element.find(this.options.main).addClass('wikistyle');
              this.footer = this.element.find(this.options.footer);
              this.file = resolveFile.apply(this);
              this.pages = createPagePanes.apply(this);
              this.scroller = $('html,body');
              
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
              var pos = inArray(file.split(/[#|★]/)[0].split(/\s/).join('-') + '.md', files),
              hash = resolveFile.apply(this),
              requestFile = (this.file = pos !== -1 ? files[pos].replace(/\.md/, '') : "");

              if(requestFile === "") {
                $.publish('wiki-file-error', [file]);
                return this.error();
              }
              
              // If location.hash is an empty string, user must be at root of /docs/, 're-route' to default file.
              if(!global.location.hash) {
                return this.updateAnchor(file);
              }
              
              // Well, if the anchor is the originaly one (most likely a refresh), popState won't happen
              if(file === hash) {
                service.get(requestFile.replace(/#/, ''), $.proxy(this.render, this)); 
              } else {
                this.updateAnchor(file);                
              }
            },

            updateTitle: function() {
              var file = this.file.replace(/.md/, '').replace(/-/g, ' '),
              star = '<!--<span>&#x2605;</span>-->',
              link = '<a href="{url}">Edit this page</a>'
                .replace(/{url}/, config.wikiUrl + this.file + '/_edit');
                
              this.header.find('h2')
                .html([file, star].join(' '))
                .append(link);
            },

            render: function(response) {      
              var md = convertor.makeHtml(escapeWikiAnchors.call(this, response));
                            
              this.main.html(md.replace(/<h1>[\w|\s|<|>|(|)|\/]+<\/h1>/, ''));

              this.updateTitle();

              this.headings();
              
              // Notify the apps that a new file is available
              $.publish('wiki-new-file', [this.file]);
            },
            
            headings: function(text) {
              // # or ...
              var t = text || global.location.hash.replace(/^#/, '').split(/[#|★]/)[1],
              hdr = this.main.find(':header'), h;

              // First thing first deal with headings and add proper data-wiki-hdr attribute
              hdr.each($.proxy(this.addHdrAttr, this));
              hdr.each($.proxy(this.addPermalinks, this));
              
              if(!t || !hdr.length) {
                return;
              }
              
              h = hdr.filter('[data-wiki-hdr^="'+t+'"]');
              
              if(!h.length) {
                return;
              }

              this.scroller.animate({scrollTop: h.offset().top}, 0);
            },
            
            addPermalinks: function(i, header) {
              var t = $(header),
              hdr  = t.attr('data-wiki-hdr');
            
              $('<span class="octothorpe"><a href="#' + this.file + '★' + hdr + '">#</a></span>').appendTo(t);
            },
                        
            addHdrAttr: function(i, header) {
              var t = $(header),
              text = t.text(),
              attr = text
                // First lower case all
                .toLowerCase()
                
                // Then replace any special character
                .replace(/[^a-z|A-Z|\d|\s|-]/g, '')
                
                // Finally, replace all blank space by - delimiter                
                .replace(/\s/g, '-');

              t.attr('data-wiki-hdr', attr);
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