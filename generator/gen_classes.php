<?php
$ie6 = $_POST['ie6'];
$ie7 = $_POST['ie7'];
$ie8 = $_POST['ie8'];
$iere = $_POST['iere'];
$viewport = $_POST['viewport'];
$iosIcon = $_POST['iosIcon'];
$noSmart = $_POST['noSmart'];
$jquery = $_POST['jQuery'];
$script = $_POST['scriptFiles'];
$png = $_POST['pngFix'];
$yui = $_POST['yui'];
$tracking = $_POST['tracking'];
$server = $_POST['serverType'];
$cssReset = $_POST['cssReset'];
$font = $_POST['font'];
$baseStyles = $_POST['base'];
$nonsem = $_POST['nonSem'];
$mediaQuery = $_POST['mediaQuery'];
$printStyle = $_POST['printStyle'];


mysql_connect("host","user", "pass") or die(mysql_error());
mysql_select_db("db") or die(mysql_error());

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=14"));
$doctype = $row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=15"));
$head_start = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=16"));
$title = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=17"));
$favicon = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=18"));
$main_style = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=19"));
$modernizr = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=20"));
$main_body = "\n".$row['code'];
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=21"));
$end_body = "\n".$row['code'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=26"));
$primarystyles = "\n".$row['code'];

if($ie6 == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=2"));
$ie6 = "\n".$row['code'];
}

if($ie7 == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=3"));
$ie7 = "\n".$row['code'];
}

if($ie8 == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=4"));	
$ie8 = "\n".$row['code'];
}

if($iere == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=5"));	
$iere = "\n".$row['code'];
}

if($viewport == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=6"));	
$viewport = "\n".$row['code'];
}
if($iosIcon == "true"){
$fetchIosIcon = "true";
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=7"));	
$iosIcon = "\n".$row['code'];
}
if($noSmart == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=8"));	
$noSmart = "\n".$row['code'];
$fetchNoSmart ="true";
}
if($jquery == "true"){
	$fetchjquery = "true";
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=9"));	
$jquery = "\n".$row['code'];
}
if($script == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=10"));	
$script = "\n".$row['code'];
$fetchscriptFiles = "true";
}
if($png == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=11"));	
$png = "\n".$row['code'];
$fetchpng = "true";
}
if($yui == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=12"));	
$yui = "\n".$row['code'];
}
if($tracking == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=13"));	
$tracking = "\n".$row['code'];
}
if($cssReset == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=22"));	
$cssReset = $row['code'];
}
if($font == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=23"));	
$font = "\n".$row['code'];
}
if($baseStyles == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=24"));	
$baseStyles = "\n".$row['code'];
}
if($nonsem == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=25"));	
$nonsem = "\n".$row['code'];
}
if($mediaQuery == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=27"));	
$mediaQuery = "\n".$row['code'];
}
if($printStyle == "true"){
$row = mysql_fetch_array(mysql_query("SELECT * FROM boilerplate WHERE id=28"));	
$printStyle = "\n".$row['code'];
}

?>