<!DOCTYPE HTML>
<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?php
session_start('pgmapcss-demo');
call_hooks("init");
?>
<html>
  <head>
    <title>pgmapcss demo page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1" />
    <script type='text/javascript' src="lib/leaflet/leaflet.js"></script>
    <script type='text/javascript' src="lib/leaflet-locationfilter/src/locationfilter.js"></script>
    <?php print modulekit_to_javascript(); /* pass modulekit configuration to JavaScript */ ?>
    <?php print modulekit_include_js(); /* prints all js-includes */ ?>
    <?php print modulekit_include_css(); /* prints all css-includes */ ?>
    <link rel='stylesheet' type='text/css' href="lib/leaflet-locationfilter/src/locationfilter.css">
  </head>
<?php
html_export_var(array("config"=>array("wms"=>$wms), "ide_current_style"=>$_REQUEST['style']));
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
  <span class='element mode-selector'><a href='http://pgmapcss.openstreetbrowser.org/blog/'>Blog</a></span>
</div>

<div id='content'>
  <div class='page page-map'>
    <div id='map'></div>
    <div id='status'></div>
  </div>
  <div id='ide' class='page page-ide'>
    <textarea id='editor' name='mapcss_file'><?php
if($_REQUEST['style']) {
  if($result = ajax_load(array("id"=>$_REQUEST['style'])))
    print $result['content'];
}
?></textarea>
    <div id='actions'>
      Defaults: <select name='defaults'>
<?php
$defaults_options = array("" => "pgmapcss", "josm" => "JOSM", "overpass-turbo" => "Overpass Turbo");
foreach($defaults_options as $optk=>$optv) {
  print "<option value='{$optk}'";
  if($result && $result['param'] && $result['param']['defaults'] &&
     ($result['param']['defaults'] == $optk))
      print " selected";
  print ">{$optv}</option>\n";
}
?>
      </select><br>
      <input type='submit' value='Update map' />
      Docu: <a href='https://github.com/plepe/pgmapcss/blob/master/doc/MapCSS.creole' target='_new'>MapCSS</a>, <a href='https://github.com/plepe/pgmapcss/blob/master/doc/<?php print $pgmapcss['template']?>.md' target='_new'>Properties</a>
    </div>
  </div>
  <div id='load' class='page page-load'>
    <div id='load-list'>
    </div>
  </div>
  <div id='export' class='page page-export'>
  </div>
</div>
</form>
</body>
</html>
