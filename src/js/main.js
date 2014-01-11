/* global ga:false */

var H5BP = H5BP || {};

// Google Analytics event tracking
H5BP.track = (function () {

    'use strict';

    $(function () {
        H5BP.track.init();
    });

    function _init() {
        var $rootEl = $('body');

        $rootEl.on('click', '[data-ga-category]', function (e) {
            var $target = $(e.currentTarget);
            var category = $target.attr('data-ga-category') || undefined; // required
            var action = $target.attr('data-ga-action') || undefined;     // required
            var label = $target.attr('data-ga-label') || undefined;
            var value = parseInt($target.attr('data-ga-value'), 10) || undefined;

            if (category && action) {
                _event(category, action, label, value);
            }
        });
    }

    function _event(category, action, label, value) {
        //console.log(category + ' | ' + action + ' | ' + label + ' | ' + value);
        if (ga) {
            // Track events
            // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
            ga('send', 'event', category, action, label, value);
        }
    }

    function _social(network, action, target) {
        //console.log(network + ' | ' + action + ' | ' + target);
        if (ga) {
            // Track social interactions
            // https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions
            ga('send', 'social', network, action, target);
        }
    }

    function _page(url) {
        //console.log(url);
        if (ga) {
            // Sends a pageview
            // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
            ga('send', 'pageview', url);
        }
    }

    return {
        init : _init,
        event : _event,
        social : _social,
        page : _page
    };

}());
