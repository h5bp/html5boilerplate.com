<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>body{background:#26a;} #center{margin:auto; width:510px;} #header{height:100px; width:510px; background:white; margin-top:10px; padding:10px;} #center #content{background:#FFF; margin-top:10px; padding:10px; width:510px;} #footer{background:#FFF; margin-top:10px; padding:10px; width:510px;}</style>
</head>
<body>
<div id="center">
<div id="header">
<h1 style="font-family:Verdana, Geneva, sans-serif;">HTML5Boilerplate Generator</h1>
</div>
<div id="content">
<form action="generate.php" method="post">
<table width="510px" border="0" cellspacing="0" cellpadding="5px" style="font-family:Verdana, Geneva, sans-serif;">
<tr>
    <td><h2>HTML</h2></td>
  </tr>
<tr>
    <td><h3>Internet Explorer Support</h3></td>
  </tr>
  <tr>
    <td><label>Internet Explorer 6 and Below</label></td>
    <td align="left"><input name="ie6" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Internet Explorer 7</label></td>
    <td align="left"><input name="ie7" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Internet Explorer 8</label></td>
    <td align="left"><input name="ie8" type="checkbox" value="true"></td>
  </tr>
  <tr>
     <td><label>Force Latest IE Rendering Engine or Chrome Frame</label></td>
    <td align="left"><input name="iere" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><h3>Mobile Support</h3></td>
  </tr>
  <tr>
    <td><label>Mobile Viewport</label></td>
    <td><input name="viewport" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>iOS Homescreen Icon</label></td>
    <td><input name="iosIcon" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>None Smartphone Stylesheet</label></td>
    <td align="left"><input name="noSmart" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><h3>Javascript</h3></td>
  </tr>
  <tr>
    <td><label>jQuery</label></td>
    <td align="left"><input name="jQuery" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Separate Script Files</label></td>
    <td align="left"><input name="scriptFiles" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>IE6 PNG Transparency Fix</label></td>
    <td align="left"><input name="pngFix" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>YUI Profiler</label></td>
    <td align="left"><input name="yui" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Google Analytics</label></td>
    <td align="left"><input name="tracking" type="checkbox" value="true"></td>
  </tr>
  <td>
    <h2>CSS</h2>
  </td>
  <tr>
    <td><label>CSS Reset</label></td>
    <td align="left"><input name="cssReset" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Font</label></td>
    <td align="left"><input name="font" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Minimal Base Styles</label></td>
    <td align="left"><input name="base" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Non-semantic helper classes</label></td>
    <td align="left"><input name="nonSem" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Media Queries</label></td>
    <td align="left"><input name="mediaQuery" type="checkbox" value="true"></td>
  </tr>
  <tr>
    <td><label>Print Styles</label></td>
    <td align="left"><input name="printStyle" type="checkbox" value="true"></td>
  </tr>
   <tr>
   <td>
    <label>Server Type</label></td>
    </tr>
    <tr>
    <td align="left" valign="middle"><select name="serverType">
      <option value="linux">Apache</option>
      <option value="windows">IIS</option>
      <option value="nginx">nginx</option>
    </select></td>
  </tr>
</table>
<input name="" type="submit" value="Submit">
</form>
</div>
<div id="footer">
&copy; Ryan Johnson
</div>
</div>
</body>
</html>