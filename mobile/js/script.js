new MBP.hideUrlBar();

// Fix for iPhone viewport scale bug 
// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/

MBP.scaleFix = function () {
  var i;
  var metas = document.getElementsByTagName('meta');
    if (navigator.userAgent.match(/iPhone/i) && !navigator.userAgent.match(/Opera/i)) {
      for (i=0; i<metas.length; i++) {
        if (metas[i].name == "viewport") {
          metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
        }
      }
      document.addEventListener("gesturestart", MBP.gestureStart, false);
    }
};

MBP.gestureStart = function () {
    var i;
    var metas = document.getElementsByTagName('meta');
    for (i=0; i<metas.length; i++) {
        if (metas[i].name == "viewport") {
          metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
        }
    }
}

var local = [
 './mobile/template/index.html',
 './mobile/template/css/style.css',
 './mobile/template/js/mylibs/helper.js',
 './mobile/template/sitemap.xml',
 './mobile/template/htaccess.txt?.xml'
];
 
 
function mycallback(data,status,xhr,filename){
 
  data = data.replace(/</g,'&lt;');
 
  var fileext = filename.replace('htaccess.txt?.xml','htaccess.apache').split('.').slice(-1)[0];
  var elem = $('<textarea>').addClass('brush:'+fileext).html(data).css('visibility','hidden');
  var point = $('#thesource').nextAll('textarea, .syntaxhighlighter').andSelf().last();
 
  elem.insertAfter(point);
  $('<h4>').html('<a>'+filename.replace('?.xml','').replace('htaccess.txt','.htaccess')+'</a>').insertAfter(point);
 
  var x = SyntaxHighlighter.highlight(undefined, elem[0]);
 
  if (mycallback.countdown === undefined) mycallback.countdown = local.length;
 
  mycallback.countdown--;
 
  if (mycallback.countdown === 0){ 
    // not sure why the movile viewport block doesnt get commented but.. it doesnt
    var viewport = $('code.plain:contains(Mobile Viewport Fix)').closest('div.line');
    viewport.nextAll().slice(0,5).add(viewport).find('.plain').toggleClass('plain comments');
 
    $('code.comments').each(function(){
      $(this).html(  linkify( this.innerHTML ) );
    })
    $('#source h4').next().hide('slow');
    $('#source h4').toggle(
      function(e) {
        $(this).addClass('active');
        $(this).next().show('slow');
        e.preventDefault();
      },
      function(e) {
        $(this).removeClass('active');
        $(this).next().hide('slow');
        e.preventDefault();
      }        
    );
  }
  
}


if(!jQuery.browser.mobile) {
  $('#source').show();
  $('#ppt').html('<iframe src="https://docs.google.com/present/embed?id=dkx3qtm_20f3cvs8gc" frameborder="0" width="410" height="342"></iframe> <iframe src="https://docs.google.com/present/embed?id=dkx3qtm_22dxsrgcf4" frameborder="0" width="410" height="342"></iframe>');
}

//$('#thesource').click(function() {
  $(this).html('Walk Through It');
	$.each(local,function(k,path){
		$.ajax({
		method: 'GET',
		dataType : 'text',
		cache : false,
		success : function(data,status,xhr){
		  mycallback(data,status,xhr,
		path.split('/').slice(-1)[0])
		},
		url : path
		})
	});

  
	//return false;
//});
  
SyntaxHighlighter.config.tagName = 'textarea';
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
 
var dsqlength = jQuery('ul#dsq-comments').length + 1;
 
jQuery('a[href=#disqus_thread]').smoothScrollTo();
 
//if (location.hash.replace('#','')=="dsq-content"){
//  jQuery('#disqus_thread').show();
//}

jQuery('a[href=#dsq-content]').toggle(
	function () {
		jQuery(this).text('Hide Comments');
        jQuery('#disqus_thread').show();
	},
	function () {
        jQuery(this).text('Show comments');
        jQuery('#disqus_thread').hide();
	}
);
/*var winloc = window.location+'';
if (!winloc.match(/thankunote/i)) {
  jQuery('#mbpupdate').hide();
  
} else {
  jQuery('a[href=#mbpupdate]').text('Hide v1.1 Thank you note');
}

jQuery('a[href=#mbpupdate]').toggle(
	function () {
		jQuery(this).text('Hide v1.1 Thank you note');
        jQuery('#mbpupdate').show();
        
	},
	function () {
        jQuery(this).text('Show v1.1 Thank you note');
        jQuery('#mbpupdate').hide();

	}
);*/
 
var disqus_developer = ( /file/.test(location.protocol) || /(localhost|dropbox)/.test(location.host) ) ? undefined : 1;
var disqus_category_id = 517513;
var disqus_url = 'http://mobile.html5boilerplate.com/';
(function() {
	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = 'http://mh5bp.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();