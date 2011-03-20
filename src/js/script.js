if (!/^en/.test(navigator.language)){
  document.body.className += ' notenglish';
}

SyntaxHighlighter.config.tagName = 'code';
SyntaxHighlighter.defaults['wrap-lines'] = true; // maybe change this
SyntaxHighlighter.defaults['auto-links'] = false;
SyntaxHighlighter.defaults['toolbar'] = false;
SyntaxHighlighter.defaults['tab-size'] = 4;

// smooth scrolling to in-page anchors.
$.fn.smoothScrollTo = function(){
  return this.live('click', function (e) {
    var elm = $(this).attr('href');
    if(!$(elm).is(':visible')) {
      $('a[href=#dsq-content]').trigger('click');
    }
    $('html,body').animate({'scrollTop': $(elm).offset().top-40+'px'}); // 40px buffer to top.
    e.preventDefault();
  });
};


var dsqlength, dsqshow;

// !~$.inArray(hash, $('.update').map(function(){ return this.id }).get()) 
if (~location.hash.replace('#','').indexOf('comment')){
  dsqshow = true;
  jQuery('#disqus_thread').show();
}

$(document).ready(function(){

  dsqlength = jQuery('ul#dsq-comments').length + 1;
  
  $('pre[class]').each(function(i, el) {
    SyntaxHighlighter.highlight(undefined, el)
  });
  
  $('.source h4 a').toggle(
    function(e) {
      $(this).addClass('active');
      $(this).parent().next().show('slow');
      e.preventDefault();
    },
    function(e) {
      $(this).removeClass('active');
      $(this).parent().next().hide('slow');
      e.preventDefault();
    }        
  );
 
  $('.videos .video iframe, .videos .video embed').attr('width', '0').attr('height', '0'); 
  var videolinks = $('.videos a[href^="#video-"]');
  videolinks.bind('click', function(e) {
    videolinks.removeClass('active');
    $(this).addClass('active');
    var activevideo = $(/#(.*)/g.exec(this.href)[0]);
    $('.videos .video-active').removeClass('video-active');
    activevideo.addClass('video-active');
    e.preventDefault();
  });  
  
  jQuery('a[href=#disqus_thread]').smoothScrollTo();

  jQuery('a[href=#dsq-content]').toggle(
    function () {
      jQuery(this).text('{% blocktrans %}Hide Comments{% blocktrans %}');
      jQuery('#disqus_thread').show();
    },
    function () {
      jQuery(this).text('{% blocktrans with "400+" as num_comments %}Show comments{% endblocktrans %}');
      jQuery('#disqus_thread').hide();
    }
  );
  
  // lazy inject the videos
  setTimeout(function(){
    $('.videos .video').each(function(){
      var html = $.trim( $(this).children().text() );
      $(html).appendTo(this);
    });
  }, 3000);

}); // end of doc ready()


// disqus
  var disqus_developer = ( /file/.test(location.protocol) || /(localhost|dropbox)/.test(location.host) ) ? undefined : 1;
  var disqus_category_id = 517513;
  var disqus_url = '{% blocktrans %}http://html5boilerplate.com/{% endblocktrans %}';
  
  // load comments after 5 sec, unless the hash is set.
  setTimeout(function() {
   var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
   dsq.src = 'http://boilerplate.disqus.com/embed.js';
   (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  }, dsqshow ? 10 : 5000);


// google analytics
var _gaq=[['_setAccount','UA-17904194-1'],['_trackPageview']];
(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
s.parentNode.insertBefore(g,s)}(document,'script'));


