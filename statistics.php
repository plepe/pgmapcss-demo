<?
$stat_create = false;
if(!file_exists("{$data_dir}/statistics.db"))
  $stat_create = true;

$stat = new SQLite3("{$data_dir}/statistics.db");

if($stat_create) {
  $stat->exec('CREATE TABLE style_load ( style text, timestamp text )');
}

register_hook("load", function($id) {
  global $stat;

  // remember load time only once per session
  if(!array_key_exists('statistics_style_loads', $_SESSION))
    $_SESSION['statistics_style_loads'] = array();

  if(in_array($id, $_SESSION['statistics_style_loads']))
    return;
  $_SESSION['statistics_style_loads'][] = $id;

  $sql_id = $stat->escapeString($id);
  $stat->exec("INSERT INTO style_load VALUES ( '{$sql_id}', datetime('now') )");
});
