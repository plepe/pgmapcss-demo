<!DOCTYPE HTML>
<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?php session_start('pgmapcss-demo'); ?>
<html>
  <head>
    <title>pgmapcss demo page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1" />
    <?php print modulekit_to_javascript(); /* pass modulekit configuration to JavaScript */ ?>
    <?php print modulekit_include_js(); /* prints all js-includes */ ?>
    <?php print modulekit_include_css(); /* prints all css-includes */ ?>
  </head>
<?php
html_export_var(array("config"=>array("wms"=>$wms)));
print_add_html_headers();
?>
  <body>
<form id='form' class='mode-view'>
<div id='menu'>
  <span id='title' class='element'><a href='https://github.com/plepe/pgmapcss' target='_new'>pgmapcss</a></span>
  <span class='element mode-selector mode-selector-map'><a href='javascript:set_mode("map")'>View</a></span>
  <span class='element mode-selector mode-selector-ide'><a href='javascript:set_mode("ide")'>Edit</a></span>
  <span class='element mode-selector mode-selector-load'><a href='javascript:set_mode("load")'>Load</a></span>
  <span class='element mode-selector mode-selector-export'><a href='javascript:set_mode("export")'>Export</a></span>
</div>

<div id='content'>
  <div class='page page-map'>
    <div id='map'></div>
    <div id='status'></div>
  </div>
  <div id='ide' class='page page-ide'>
    <textarea id='editor' name='mapcss_file'></textarea>
    <div id='actions'>
      <input type='submit' value='Update map' />
      Docu: <a href='https://github.com/plepe/pgmapcss/blob/master/doc/MapCSS.creole' target='_new'>MapCSS</a>, <a href='https://github.com/plepe/pgmapcss/blob/master/doc/mapnik-2.2.creole' target='_new'>Properties</a>
    </div>
  </div>
  <div id='load' class='page page-load'>
    <div id='load-list'>
    </div>
  </div>
  <div id='export' class='page page-export'>
    <div id='actions'>
      <input type='submit' name='export' value='Export' />
    </div>
  </div>
</div>
</form>
</body>
</html>
