<?
$depend = array(
  "modulekit-ajax", "hooks", "adv_exec", "html", "modulekit-form",
);

$include = array(
  'php'=>array(
    'pgmapcss.php',
    'statistics.php',
  ),
  'js'=>array(
    'lib/leaflet/leaflet.js',
    'lib/leaflet.singletilewmslayer/leaflet.singletilewmslayer.js',
    'lib/browserstate-history.js/scripts/bundled/html4+html5/native.history.js',
    'index.js',
    'map.js',
    'ide.js',
    'load.js',
    'export.js',
  ),
  'css'=>array(
    'lib/leaflet/leaflet.css',
    'style.css',
  ),
);
