new MBP.hideUrlBar();

// Fix for iPhone viewport scale bug 
// www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/

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

if(!jQuery.browser.mobile) {
  $('#ppt').html('<iframe src="https://docs.google.com/present/embed?id=dkx3qtm_20f3cvs8gc" frameborder="0" width="410" height="342"></iframe> <iframe src="https://docs.google.com/present/embed?id=dkx3qtm_22dxsrgcf4" frameborder="0" width="410" height="342"></iframe>');
}


$('#intro').prevAll('a').first().click(function(){
    $('#header').toggleClass('showintro');
    return false;
  });

 
