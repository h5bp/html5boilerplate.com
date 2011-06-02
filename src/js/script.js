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


var dsqshow, loadcomments = function() {
  if(!dsqshow){
    dsqshow = true;
    loaddisqus();
  }  
  jQuery('#disqus_thread').show();    
}, loaddisqus = function() {
    var disqus_developer = ( /file/.test(location.protocol) || /(localhost|dropbox)/.test(location.host) ) ? undefined : 1;
    var disqus_category_id = 517513;
    var disqus_url = '{% blocktrans %}http://html5boilerplate.com/{% endblocktrans %}';

    setTimeout(function() {
     var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
     dsq.src = 'http://boilerplate.disqus.com/embed.js';
     (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }, 10);  
};


$(document).ready(function(){   
     
  $('pre[class]').each(function(i, el) {
    SyntaxHighlighter.highlight(undefined, el);
  });
  $('div.source code.comments').each(function(){
    $(this).html(  linkify( this.innerHTML ) );
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
      loadcomments();
    },
    function () {
      jQuery(this).text('{% blocktrans with "400+" as num_comments %}Show comments{% endblocktrans %}');
      jQuery('#disqus_thread').hide();
    }
  );
  
  // !~$.inArray(hash, $('.update').map(function(){ return this.id }).get()) 
  if (~location.hash.replace('#','').indexOf('comment')){
    loadcomments();
    jQuery('a[href=#dsq-content]').click();
  }
    
  // lazy inject the videos
  setTimeout(function(){
    $('noscript').each(function(){
      var html = $.trim( $(this).text() ) || $.trim( $(this).attr('data-html') )
      $(html).insertBefore(this);
    });
  }, 3000);

  $('#intro').prevAll('a').first().click(function(){
    $('#header').toggleClass('showintro');
    return false;
  });


}); // end of doc ready()


// google analytics
var _gaq=[['_setAccount','UA-17904194-1'],['_trackPageview'],['_trackPageLoadTime']];
(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
s.parentNode.insertBefore(g,s)}(document,'script'));

$(function(){
	var parameters = {}, builder = $('#builder'), downloadelm = $('#builder-download'), downloadurl = downloadelm.attr('href');
	$('#builder-custom').toggle(function(e) {
	  builder.css({ opacity: 0 }).show().animate({ opacity: 1}, 1000);
    e.preventDefault();
	}, function(e) { builder.animate({ opacity: 0 }, 1000, function() { builder.hide('slow'); }); e.preventDefault(); });
	
	$("#builder > div > a").click(function(e){
	  var that = $(this); 
	  var option = that.parent();
		option.find("a").removeClass("selected");
		var choice = that[0].id;
    if(choice) {
		    that.addClass("selected");
		    parameters[option[0].id] = /^default\-/g.exec(choice) ? '' : choice;
      }		  
      e.preventDefault();
	});
	
	downloadelm.click(function() { 
	  var params = '';
	  var trackparams = '';
    $.each(parameters, function(key, value) { if(value) { params += value + '&'; } });
		if (params != '') {trackparams = '&'+params;}
		_gaq.push(['_trackPageview', '/build/'+trackparams.substr(0, trackparams.length-1)]);
		this.href =  downloadurl + params.substr(0, params.length-1);
	});	
});




(function(d){d.fn.invert=function(){d(this).find("*").andSelf().each(function(){var e=d(this);a("color",e);a("backgroundColor",e);d.each(["right","bottom","left","top"],function(f,g){a("border-"+g+"-color",e)});c(e)});return this};function a(h,f){var g=b(f.css(h));if(g!="transparent"&&g.substring(0,4)!="rgba"){var e=/rgb\((.+),(.+),(.+)\)/.exec(g);f.css(h,"rgb("+(255-e[1])+","+(255-e[2])+","+(255-e[3])+")")}}function b(g){if(g.substring(0,3)=="rgb"||g=="transparent"){return g}if(g.substring(0,1)=="#"){if(g.length==4){g="#"+g.substring(1,2)+g.substring(1,2)+g.substring(2,3)+g.substring(2,3)+g.substring(3,4)+g.substring(3,4)}return"rgb("+parseInt(g.substring(1,3),16)+","+parseInt(g.substring(3,5),16)+","+parseInt(g.substring(5,7),16)+")"}var e=["black","white","red","yellow","gray","blue","green","lime","fuchsia","aqua","maroon","navy","olive","purple","silver","teal"],f=["(0, 0, 0)","(255, 255, 255)","(255, 0, 0)","(255, 255, 0)","(128, 128, 128)","(0, 0, 255)","(0,128,0)","(0, 255, 0)","(255, 0, 255)","(0, 255, 255)","(128, 0, 0)","(0, 0, 128)","(128, 128, 0)","(128, 0, 128)","(192, 192, 192)","(0, 128, 128)"];g=f[d.inArray(g,e)]||g;return"rgb"+g}function c(h){if(!(h.is("img")||/^(data|url)/.test(h.css("backgroundImage")))){return}var e=new Image();d(e).bind("load",function(){var m=document.createElement("canvas");m.width=e.width;m.height=e.height;var j=m.getContext("2d"),s=0,r=0,t;try{j.drawImage(e,s,r);var k=j.getImageData(s,r,e.width,e.height);var q=k.data;for(var o=0,l=q.length;o<l;o+=4){q[o]=255-q[o];q[o+1]=255-q[o+1];q[o+2]=255-q[o+2]}j.putImageData(k,s,r);t=m.toDataURL()}catch(p){}if(h.is("img")){h.attr("src",t)}else{h.css("backgroundImage","url("+t+")")}}).each(function(){if(this.complete||this.complete===undefined){var i=this.src;this.src="#";this.src=i}});var f=h.css("backgroundImage").match(/url\((.*?)\)/),g=f&&f[1];e.src=h[0].src||g||h.css("backgroundImage")}})(jQuery);


// i have no idea what this is but i imagine it must be awesoWHAAT
var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
$(document).keydown(function(e) {
  kkeys.push( e.keyCode );
  if ( kkeys.toString().indexOf( konami ) >= 0 ){
    $(document).unbind('keydown',arguments.callee);
    $.fn.invert && $('body').invert();
  }
});

