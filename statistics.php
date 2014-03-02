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

  $sql_id = $stat->escapeString($id);

  $stat->exec("INSERT INTO style_load VALUES ( '{$sql_id}', datetime('now') )");
});
