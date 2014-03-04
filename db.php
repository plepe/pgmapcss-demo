<?
$stat = new SQLite3("{$data_dir}/statistics.db");

function db_check_table($table_name, $create_statement) {
  global $stat;

  $res = $stat->query("SELECT name FROM sqlite_master WHERE type='table' AND name='{$table_name}'");
  $ret = false;
  if($res->fetchArray())
    $ret = true;

  $res->finalize();

  if(!$ret) {
    $stat->query($create_statement);
  }
}
