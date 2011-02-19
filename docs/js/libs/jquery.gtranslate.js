/**
*
* a jQuery plugin to work with google translate api.
*
* http://code.google.com/intl/fr-FR/apis/language/translate/v2/using_rest.html#language-params
*
* Usage: 
* 
*   $('selector').gtranslate({
*     key: 'yourApiKey',    // Feel in your api key https://code.google.com/apis/console/
*     elements: 'selector'  // list of text elements to be translated, in the context of the plugin element (default is p, ul, ol, :header)
*     source: 'fr',         // {optional} Language code of the source text, if none google will try to detect it for us
*     target: 'en',         // {optional} Target language code, if none navigator.language is used
*     autoInit: true        // {optional} Default is false in which case the API must be used
*   });
*   
*
*   TODO
*     // Actually performs the translation with default settings
*     .gtranslate('translate')
*
*     // Provides source and target langage code to use
*     .gtranslate('translate', source, target)
*     
*     // When only one langage code is provided, we'll use auto-detect feature of google translate api
*     .gtranslate('translate', target)
*     
*
*     // A simple getter on elements provided. Acts as getter, breaks the chain
*     .gtranslate('elements') 
*
*     // A simple setter on elements to work with
*     .gtranslate('elements', 'selector')
*     
* 
* @namespace jQuery
* @author mdaniel
* @version 0.0.1
*/
(function ($, W, D, N) {

    var gTranslate = function (o) {

        var url = "https://www.googleapis.com/language/translate/v2",
        

        error = function error() {
          log('error: ', this, arguments);
        },
        
        success = function success(results, element) {
            if (results.error) {
                return error.apply(this, arguments);
            }
            
            element.html(results.data.translations[0].translatedText);
        };

        return {
            options: {
                data: {
                  key: 'apiKey',
                  source: 'en'
                },
                elements: 'p, ul, ol, :header',
                target: N && N.language ? N.language : 'en'
            },

            init: function init(options, elem) {
                var self = this;
                
                // Overload the passed in options with any default options
                this.options = $.extend({}, this.options, options);

                // Set the relative element as the passed in element
                this.element = $(elem);
                this.dom = elem;
                
                this.element.find('#header a').bind('click', function(){
                  var lg = $(this).attr('lang');
                  self.options.data.target = lg.split('-')[0];
                  self.translateElements(self.options.target);
                  return false;
                });
            },
          
            
            translateElements: function translateElements(target) {
                var self = this, 
                elements = this.element.find(this.options.elements),
                l = elements.length, i = 0;
                
                if(this.msg) {
                  this.msg.detach(); 
                }
                
                
                elements.each(function () {
                    var el = $(this);
                    i++;
                    self.translate(el, (i === l ? target : ""));
                });
                              
            },

            translate: function translate(element, target) {
                var html = element.html(),
                self = this,
                o = $.extend({}, this.options.data, {q: html});
                
                this.request({
                    data: o,
                    success: function (results) {
                        if(target) {
                          self.options.data.source = target;
                        }
                        
                        success.call(this, results, element);
                    }
                });
            },
            
            request: function request(o) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: o.success,
                    error: error,
                    data: o.data
                });               
            }
        };
    };

    // Set up prototypal inheritance - if it doesn't exist
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    $.fn.gtranslate = function (o) {
        o = o || {};

        if (!this.length) {
            return this;
        }

        return this.each(function () {
            var gtranslate = Object.create(gTranslate());
            gtranslate.init(o, this);
            $.data(this, 'gtranslate', gtranslate);
        });
    };


}(this.jQuery, this, this.document, this.navigator));