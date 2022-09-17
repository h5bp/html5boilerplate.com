/* global ga:false */

(function (window) {

  'use strict';

  var document = window.document;

  // -----------------------------------------------------------------
  // | Twitter                                                       |
  // -----------------------------------------------------------------

  // Tweet Buttons
  // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview

  function loadTweetButtons() {
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  window.onload = loadTweetButtons;

}(window));
