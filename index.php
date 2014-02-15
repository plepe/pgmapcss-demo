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
  <body>
<div id='map'></div>
<form id='ide'>
<textarea id='editor' name='mapcss_file'></textarea>
<input type='submit' value='Save' />
</form>
  </body>
</html>
