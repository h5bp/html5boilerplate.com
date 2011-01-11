<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>body{background:#26a;} #center{margin:auto; width:510px;} #header{height:100px; width:510px; background:white; margin-top:10px; padding:10px;} #center #content{background:#FFF; margin-top:10px; padding:10px; width:510px;} #footer{background:#FFF; margin-top:10px; padding:10px; width:510px;}</style>
<title>HTML5Boilerplate Generator</title>
</head>
<body>
<div id="center">
<div id="header">
<h1 style="font-family:Verdana, Geneva, sans-serif;">HTML5Boilerplate Generator</h1>
</div>
<div id="content">

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
copy("source/favicon.ico", $folder."/favicon.ico");
copy("source/404.html", $folder."/404.html");
if($fetchIosIcon =="true"){
copy("source/apple-touch-icon.png", $folder."/apple-touch-icon.png");
}

if($fetchscriptFiles =="true"){
copy("source/js/script.js", $folder."/js/script.js");
copy("source/js/plugins.js", $folder."/js/plugins.js");
}
if($fetchNoSmart == "true"){
copy("source/css/handheld.css", $folder."/css/handheld.css");
}

if($fetchpng == "true"){
copy("source/js/libs/dd_belatedpng.js", $folder."/js/libs/dd_belatedpng.js");
}

if($server =="linux"){
	copy("source/.htaccess", $folder."/.htaccess");
}
elseif($server =="windows"){
	copy("source/web.config", $folder."/web.config");
}
elseif($server=="nginx"){
	copy("source/nginx.conf", $folder."/nginx.conf");
}

if($fetchjquery =="true"){
copy("source/js/libs/jquery-1.4.4.min.js", $folder."/js/libs/jquery-1.4.4.min.js");
copy("source/js/libs/jquery-1.4.4.js", $folder."/js/libs/jquery-1.4.4.js");
}
copy("source/js/libs/modernizr-1.6.min.js", $folder."/js/libs/modernizr-1.6.min.js");
exec("tar -cvzpf tmp/html5".$now['seconds'].$now['minutes'].$now['mday'].$now['mon'].".tar.gz ".$folder."");
$file = "/tmp/html5".$now['seconds'].$now['minutes'].$now['mday'].$now['mon'].".tar.gz";
echo "<a href='".$file."'>Download your boilerplate</a>";

?><br>
<br>

<a href="index.php">Go Back</a>
</div>
<div id="footer">
&copy; Ryan Johnson
</div>
</div>
</body>
</html>