if (!/^en/.test(navigator.language)){
  document.body.className += ' notenglish';
}

SyntaxHighlighter.config.tagName = 'code';
SyntaxHighlighter.defaults['wrap-lines'] = true; // maybe change this
SyntaxHighlighter.defaults['auto-links'] = false;
SyntaxHighlighter.defaults['toolbar'] = false;
SyntaxHighlighter.defaults['tab-size'] = 4;

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
      $(this).parent().next().stop().show('slow');
      e.preventDefault();
    },
    function(e) {
      $(this).removeClass('active');
      $(this).parent().next().stop().hide('slow');
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
	var parameters = [], builder = $('#builder'), downloadelm = $('#builder-download'), downloadurl = downloadelm.attr('href');
	$('#builder-custom').toggle(function(e) {
	  builder.css({ opacity: 0 }).show().animate({ opacity: 1}, 1000);
    e.preventDefault();
	}, function(e) { builder.animate({ opacity: 0 }, 1000, function() { builder.hide('slow'); }); e.preventDefault(); });
	
	$('#builder input:checked').each(function() { parameters.push(this.id); });
	
	$("#builder input").click(function(e){
	  var that = $(this),
	      choice = that[0].id,
        existsAt = parameters.indexOf(choice);

    if(that.is(':checked') && (existsAt === -1)) {
      parameters.push(choice);
      if(choice == 'h5bp-iecond') {
        var iecond = parameters.indexOf('simplehtmltag');
        if(iecond > -1) {
          parameters.splice(iecond, 1);          
        }
      }       
    }

    if(!that.is(':checked') && (existsAt !== -1)) {
      parameters.splice(existsAt, 1);
      if(choice == 'h5bp-iecond') {
        parameters.push('simplehtmltag');
      }       
    } else if(!that.is(':checked') && (choice == 'jquerydev' || choice == 'jquerymin')) {
        var jquery = parameters.indexOf('jquery');
        if(jquery > -1) {
          parameters.push(choice == 'jquerymin'? 'jquerydev': 'jquerymin');
          parameters.splice(jquery, 1);          
        }              
    }
	});
	
	downloadelm.click(function() { 
	  var params = '';
	  //Replace refs to both jQueries with one
	  var jquerymin = parameters.indexOf('jquerymin'),
	      jquerydev = parameters.indexOf('jquerydev'),
        jquery;
	  if((jquerymin > -1) && (jquerydev > -1) && (parameters.indexOf('jquery') == -1)) {
	    parameters.splice(jquerymin, 1);
	    jquerydev = parameters.indexOf('jquerydev');
	    if(jquerydev > -1) {
	      parameters.splice(jquerydev, 1);	      
	    }
	    parameters.push('jquery');
	  }
	  	
	  params = parameters.join('&');
		_gaq.push(['_trackPageview', '/build/&print&'+ params]);
		this.href =  downloadurl + params;
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

