/**
* This module defines the highlight one which adds syntax highlighting to wiki content.
*
* The SyntaxHighlighter dependency is still not a regular require module and is included in require-jquery.js which
* is a custom built ot startup file (includes requirejs, jquery and the stuff that were in plugins.js - bridge utility / object.create 
* for our prototypal inheritence, SyntaxHightlighter etc. may change in the future maybe not the smartest way of doing things).
*
* This module is subscribed to the wiki-new-file topic and reacts accordingly by calling the highlight method.
*
*/
define(

// Dependencies
['app/modules/base', 'libs/pubsub'],

// entry point
function(base) {
  
    var module = $.extend({}, base, Object.create({
        options: {},
        init: function() {

            SyntaxHighlighter.config.tagName = 'textarea';
            SyntaxHighlighter.defaults['wrap-lines'] = true;
            // maybe change this
            SyntaxHighlighter.defaults['auto-links'] = false;
            SyntaxHighlighter.defaults['toolbar'] = false;
            SyntaxHighlighter.defaults['tab-size'] = 4;

            $.subscribe('wiki-new-file', $.proxy(this.highlight, this));
        },

        // TODO seriously... For now, SyntaxHighlighter will always be in html or css mode.
        resolveLang: function(html) {
            var rHtml = /&lt;.+&gt;/gim;
            
            var val = rHtml.test(html) ? "html": "css";

            return val;
        },
        
        highlight: function() {
            var codes = this.element.find('pre code'),
            self = this;

            $.each(codes, function(i, code) {
                var t = $(code),
                html = t.html(),
                elem = $('<textarea>').addClass('brush:' + t.data('language'))
                .html(html)
                .css('visibility', 'hidden')
                .insertBefore(t.closest('pre'));

                SyntaxHighlighter.highlight(undefined, elem[0]);
            });

            codes.closest('pre').remove();
        }
    }));
    
  
    $.bridge('highlight', module);

    return module;
});



