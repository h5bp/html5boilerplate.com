/**
* This module defines the messaging one which adds message feature and log managaement to our application.
*
* It basically subscribes itself to the following topic:
*   - wiki-new-file
*   - wiki-request-file
*   - wiki-request-file-success
*
* And trigger according action. Most relevent stuff is probably the deal with long running xhr and the inclusion of a user
* feedback (Simply a Loading... message).
*
* It could also serves as a logging support by registering hiself to interresting topic and logging them. It has the rough 
* notion of log level that you can set during initialization 
* $('.domElement').messaging({level: 0 // actually just something equals or greater than 0}).
*
*/
define(

// Dependencies
['app/modules/base', 'libs/pubsub'],

// entry point
function(base) {
  
    var messaging = (function() {
        var message = $('<div />', {
            'class': 'wikiconvertor-message wikiconvertor-message-content'
        }),

        messages = [],

        messageTmpl = "<p>{message}</p>";

        return {
            DEBUG: 0,
            init: function(options, elem) {
                this.content = this.element.find('.wikiconvertor-content');
                $.subscribe('wiki-new-file', $.proxy(this.newFile, this));
                $.subscribe('wiki-request-file', $.proxy(this.requestFile, this));
                $.subscribe('wiki-request-file-success', $.proxy(this.requestFileSuccess, this));
                // $.subscribe('wiki-history-change', $.proxy(this.history, this));
            },

            message: function(msg) {
                messages.push(msg);
                this.content.html(messageTmpl.replace(/{message}/, msg));
            },

            newFile: function() {
                this.log('newFile', this, arguments);
            },

            requestFile: function() {
                this.log('requestFile', this, arguments);
                this.message('Loading...');
            },

            requestFileSuccess: function() {
                this.log('requestFileSuccess', this);
            },

            log: function() {
                if (this.options.level >= this.DEBUG) {
                    console.log.apply(console, arguments);
                }
            }
        };
    })(),
    
    module = $.extend({}, base, Object.create(messaging));
    
    $.bridge('messaging', module);
    
    return module;
});