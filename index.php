<!DOCTYPE HTML>
<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<html>
  <head>
    <title>pgmapcss demo page</title>
    <?php print modulekit_to_javascript(); /* pass modulekit configuration to JavaScript */ ?>
    <?php print modulekit_include_js(); /* prints all js-includes */ ?>
    <?php print modulekit_include_css(); /* prints all css-includes */ ?>
  </head>
<?php
html_export_var(array("config"=>array("wms"=>$wms)));
print_add_html_headers();
?>
  <body>
<form id='form'>
<div id='menu'>
  <span id='title' class='element'><a href='https://github.com/plepe/pgmapcss' target='_new'>pgmapcss</a></span>
  <span class='element'><input type='submit' value='Update map' /></span>
</div>

<div id='map'></div>
<div id='ide'>
<textarea id='editor' name='mapcss_file'></textarea>
</div>
<div id='status'>Coord | Version | Map Date</div>
</form>
</body>
</html>
