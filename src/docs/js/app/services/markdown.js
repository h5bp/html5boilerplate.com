/**
* This service defines the needed interface to work with wiki the datasource content.
*
* It provides a very small API surface with request and get method. request is our low-level requesting method 
* (the one that actually manipulate $.ajax), others are shortcuts.
*
* The most important stuff done here is probably the cache system done on request call. It uses a cache internal 
* (and private) function to "cachify" the request method. Any file that request is asked for is stored locally in 
* the c internal variable with key's value is the file name. (ex: request('myfile.md', cb) would results if success 
* in a new object stored in the c variable with key 'myfile.md' --> c['myfile.md'])
*
* Any new requests results in a normal xhr. Any requests on files that are available in cache will grab the content 
* of the cache, and a new xhr is prevented.
*
* This service also publish the following topics:
*  - wiki-file-error on xhr error
*  - wiki-request-file-success on xhr success
*
*/
define(['config', 'libs/pubsub'], function(config) {
    var cache = function(fn) {
        var c = {};
        return function(file, cb) {
            var item = c[file],

            _cb = cb,

            cb = function(r) {
                var cFile = c[file];
                if (cFile) {
                    cFile.content = r;
                }
                return _cb.apply(this, arguments);
            };

            item = item ? item: (c[file] = {
                filename: file,
                cb: cb,
                content: ''
            });

            if (item.content) {
                return cb.call(this, c[file].content);
            }

            fn.apply(this, arguments);
        }
    },

    error = function() {
        $.publish('wiki-file-error', arguments);
    };

    return {
        ext: config.ext,
        baseUrl: config.baseUrl,
        base: config.baseFile,
        init: function(options) {
            options = options || {};
            this.baseUrl = options.wiki ? options.wiki: config.baseUrl;
        },
        request: cache(function(file, cb) {
            $.publish('wiki-request-file', [file]);
            return $.ajax({
                url: file + this.ext + '?' + (+new Date), //cachebust neccessary
                dataType: 'text',
                error: $.proxy(error, this),
                success: $.proxy(function() {
                    $.publish('wiki-request-file-success', arguments);
                    cb.apply(this, arguments);
                }, this)
            });
        }),

        get: function(file, cb) {
            if ($.isFunction(file)) {
                cb = file;
                file = this.base;
            }

            file = file === "" ? this.base: file;

            return this.request(this.baseUrl + file, cb);
        }
    }
});