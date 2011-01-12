<!doctype html>  
<!--[if lt IE 7 ]> <html lang="{{ LANGUAGE_CODE }}" dir="{{ LANGUAGE_DIRECTION }}" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="{{ LANGUAGE_CODE }}" dir="{{ LANGUAGE_DIRECTION }}" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="{{ LANGUAGE_CODE }}" dir="{{ LANGUAGE_DIRECTION }}" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="{{ LANGUAGE_CODE }}" dir="{{ LANGUAGE_DIRECTION }}" class="no-js ie9"> <![endif]-->   
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="{{ LANGUAGE_CODE }}" dir="{{ LANGUAGE_DIRECTION }}" class="no-js"> <!--<![endif]-->
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1" >
  <meta charset="utf-8">

  <title>{% blocktrans %}HTML5 Boilerplate{% endblocktrans %} - {% blocktrans %}A rock-solid default for HTML5 awesome.{% endblocktrans %}</title>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">  

  <link rel="shortcut icon" href="favicon.png" >
  <link rel="apple-touch-icon" href="//html5boilerplate.com/apple-touch-icon.png"> 

  <link rel="stylesheet" type="text/css" media="screen" href="css/screen.css" >
  <link type="text/css" rel="stylesheet" media="screen" href="http://html5boilerplate.com/css/shCore.css" >

  <!-- JavaScript at the bottom -->
  <script src="//html5boilerplate.com/js/libs/modernizr-1.6.min.js"></script> 
</head>
<body>
  <div id="container"> 
    <b class="border-a"></b>
    <b class="border-b"></b>
    <b class="border-c"></b>
    <b class="border-d"></b>

    <div id="header">  
         <p class="lang">Now offered in:  
           <a href="http://html5boilerplate.com" lang="en-us">English</a>
           <a href="http://de.html5boilerplate.com" lang="de-de">Deutsch</a>
           <a href="http://br.html5boilerplate.com" lang="pt-br">Português</a>
           <a href="http://fr.html5boilerplate.com" lang="fr-fr">Français</a>
           <a href="http://it.html5boilerplate.com" lang="it">Italiano</a>
           <a href="http://nl.html5boilerplate.com" lang="nl">Nederlands</a>
           <a href="http://sr.html5boilerplate.com" lang="sr">Srpski</a>           
         </p>        
         <h1>HTML5  <i>&#x2605;</i> Boilerplate</h1> 
         <h2>{% blocktrans %}A rock-solid default for HTML5 awesome.{% endblocktrans %}</h2>  
         <p>{% blocktrans %}HTML5 Boilerplate is the professional badass's base HTML/CSS/JS template for a fast, robust and future-proof site.{% endblocktrans %}</p>
         <p>{% blocktrans %}After more than two years in iterative development, you get the best of the best practices baked in: cross-browser normalization, performance optimizations, even optional features like cross-domain Ajax and Flash. A starter apache .htaccess config file hooks you the eff up with caching rules and preps your site to serve HTML5 video, use @font-face, and get your gzip zipple on.{% endblocktrans %}</p>
         <p>{% blocktrans %}Boilerplate is not a framework, nor does it prescribe any philosophy of development, it's just got some tricks to get your project off the ground quickly and right-footed.{% endblocktrans %}</p>
    </div>

    <div id="body">
	<h3>Generator</h3>
     <?php
include 'gen_classes.php';
$now = getdate();
$folder = "output/html5".$now['seconds'].$now['minutes'].$now['mday'].$now['mon'];
mkdir($folder);
mkdir($folder."/js");
mkdir($folder."/css");
mkdir($folder."/images");
mkdir($folder."/js/libs");	
mkdir($folder."/js/mylibs");	
$ourFileName = $folder."/index.html";
$ourFileHandle = fopen($ourFileName, 'w') or die("can't open file");
fwrite($ourFileHandle, $doctype.$ie6.$ie7.$ie8.$head_start.$iere.$title.$viewport.$favicon.$iosIcon.$main_style.$noSmart.$modernizr.$main_body.$jquery.$script.$png.$yui.$tracking.$end_body);
fclose($ourFileHandle);

$ourFileName = $folder."/css/style.css";
$ourFileHandle = fopen($ourFileName, 'w') or die("can't open file");
fwrite($ourFileHandle, $cssReset.$font.$baseStyles.$nonsem.$primarystyles.$mediaQuery.$printStyle);
fclose($ourFileHandle);
copy("template/favicon.ico", $folder."/favicon.ico");
copy("template/404.html", $folder."/404.html");
if($fetchIosIcon =="true"){
copy("template/apple-touch-icon.png", $folder."/apple-touch-icon.png");
}

if($fetchscriptFiles =="true"){
copy("template/js/script.js", $folder."/js/script.js");
copy("template/js/plugins.js", $folder."/js/plugins.js");
}
if($fetchNoSmart == "true"){
copy("template/css/handheld.css", $folder."/css/handheld.css");
}

if($fetchpng == "true"){
copy("template/js/libs/dd_belatedpng.js", $folder."/js/libs/dd_belatedpng.js");
}

if($server =="linux"){
	copy("template/.htaccess", $folder."/.htaccess");
}
elseif($server =="windows"){
	copy("template/web.config", $folder."/web.config");
}
elseif($server=="nginx"){
	copy("template/nginx.conf", $folder."/nginx.conf");
}
elseif($server == "noServer"){

}
if($build == "true"){
copy("template/build/*");	
}

if($fetchjquery =="true"){
copy("template/js/libs/jquery-1.4.4.min.js", $folder."/js/libs/jquery-1.4.4.min.js");
copy("template/js/libs/jquery-1.4.4.js", $folder."/js/libs/jquery-1.4.4.js");
}
copy("template/js/libs/modernizr-1.6.min.js", $folder."/js/libs/modernizr-1.6.min.js");
exec("zip -r tmp/html5".$now['seconds'].$now['minutes'].$now['mday'].$now['mon'].".zip ".$folder."");
$file = "tmp/html5".$now['seconds'].$now['minutes'].$now['mday'].$now['mon'].".zip";
?> 
<p class="dwn">
        <span><?php echo "<a href='".$file."'>Download your boilerplate</a>";?></span>
      </p>

    </div>
    <div id="footer">
      <p>
        <em class="focus">{% blocktrans %}Brought to you by{% endblocktrans %}</em>
        <a href="http://paulirish.com"><img width="50" height="50" src="//html5boilerplate.com/images/paul-irish.png" alt=""> Paul Irish <i>{% blocktrans %}Google Chrome, jQuery{% endblocktrans %}</i></a>
        <a href="http://nimbupani.com"><img width="50" height="50" src="//html5boilerplate.com/images/divya-manian.png" alt="">Divya Manian <i>{% blocktrans %}Open Web Vigilante{% endblocktrans %}</i></a>
      </p> 
      <ul>
        <li><a href="http://www.blog.highub.com/">Shi Chuan</a></li>
        <li><a href="http://mikewest.org/">Mike West</a></li>   
        <li><a href="http://htmlcssjavascript.com/">Rob Larsen</a></li>
        <li><a href="http://www.mintusability.com">Mikko Tikkanen</a></li>
        <li><a href="http://twitter.com/niksy">Ivan Nikolić</a></li>
        <li><a href="http://velir.com/">Velir</a></li>
        <li><a href="http://adeelejaz.com/">Adeel Ejaz</a></li>
        <li><a href="http://garowetz.ca/">Stephen Gariepy</a></li>
      </ul> <br>
      <p>{% blocktrans %}It would not have been possible without the efforts of these superheroes:{% endblocktrans %}</p>
      <ul>
        <li><a href="http://www.phpied.com">Stoyan Stefanov</a></li>
        <li><a href="http://mathiasbynens.be/">Mathias Bynens</a></li>   
        <li><a href="http://meyerweb.com/">Eric Meyer</a></li>
        <li><a href="http://richclarkdesign.com/">Richard Clark</a></li>
        <li><a href="http://www.aestheticallyloyal.com/">Anthony Kolber</a></li>
        <li><a href="http://www.splintered.co.uk/">Patrick H Lauke</a></li>
        <li><a href="http://timvandamme.com">Tim Van Damme</a></li>
        <li><a href="http://farukat.es/">Faruk Ate&#351;</a></li>
        <li><a href="http://remysharp.com/">Remy Sharp</a></li>
        <li><a href="http://www.dillerdesign.com/">Drew Diller</a></li>
        <li><a href="http://blog.amodernfable.com/">Adam McIntyre</a></li>
        <li><a href="http://tjkdesign.com/">Thierry Koblentz</a></li>
        <li><a href="http://miketaylr.com">Mike Taylor</a></li>
        <li><a href="http://iecss.com">Jonathan Neal</a></li>
        <li><a href="http://camendesign.com">Kroc Camen</a></li>
        <li><a href="http://fontsquirrel.com">Ethan Dunham</a></li>
        <li><a href="http://peter.sh">Peter Beverloo</a></li>         
        <li><a href="http://code.flickr.com/blog/">Flickr</a></li>
        <li><a href="http://www.viget.com/inspire/">Viget</a></li>
        <li><a href="http://stevesouders.com/">Steve Souders</a></li>
        <li><a href="http://stuffandnonsense.co.uk/blog">Andy Clarke</a>
        <li><a href="http://na.isobar.com">Isobar Interface Development team</a></li>
      </ul>
    </div> 
    <div class="disqus-wrapper">
      <div id="disqus_thread">
        <h3>{% blocktrans %}Comments{% endblocktrans %}</h3>
        <p>{% blocktrans %}Comments for Boilerplate v0.9.1 can be found in the <a href="commentarchive.html">archive</a>{% endblocktrans %}</p>
      </div>
      <a href="#dsq-content">{% blocktrans with "400+" as num_comments %}Show comments{% endblocktrans %}</a> 
    </div>
  </div>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script src="http://github.com/cowboy/javascript-linkify/raw/master/ba-linkify.min.js"></script>
  <script type="text/javascript" src="//html5boilerplate.com/js/plugins.js"></script>

  <script  >



    var local = [
     './template/index.html',
     './template/css/style.css',
     './template/js/script.js',
     './template/js/plugins.js',
     './template/crossdomain.xml',
     './template/robots.txt?.xml',
     './template/htaccess.txt?.xml'
    ];


    function mycallback(data,status,xhr,filename){
          //console.log(arguments);

      data = data.replace(/</g,'&lt;');


      var fileext = filename.replace('htaccess.txt?.xml','htaccess.apache').split('.').slice(-1)[0];
      var elem = $('<textarea>').addClass('brush:'+fileext).html(data).css('visibility','hidden');
      var point = $('#thesource').nextAll('textarea, .syntaxhighlighter').andSelf().last();

      elem.insertAfter(point);
      $('<h4>').text(filename.replace('?.xml','').replace('htaccess.txt','.htaccess')).insertAfter(point);

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
      }



    }

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

    var dsqlength = jQuery('ul#dsq-comments').length + 1;

    jQuery('a[href=#disqus_thread]').smoothScrollTo();

    if (location.hash.replace('#','')){
      jQuery('#disqus_thread').show();
    }

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
  </script>

  <script type="text/javascript">
      var disqus_developer = ( /file/.test(location.protocol) || /(localhost|dropbox)/.test(location.host) ) ? undefined : 1;
      var disqus_category_id = 517513;
      var disqus_url = '{% blocktrans %}http://html5boilerplate.com/v095{% endblocktrans %}';
      (function() {
       var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       dsq.src = 'http://boilerplate.disqus.com/embed.js';
       (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();
  </script>
  <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
   
  <script>
   var _gaq = [['_setAccount', 'UA-17904194-1'], ['_trackPageview']];
   (function(d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.async = true;
    g.src = ('https:' == location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g, s);
   })(document, 'script');
  </script>

</body>
</html>
