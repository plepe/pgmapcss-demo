<?
function statistics_check_db() {
  db_check_table('style_load', 'CREATE TABLE style_load ( style text, timestamp text )');
}

register_hook("load", function($id) {
  global $stat;
  statistics_check_db();

  // remember load time only once per session
  if(!array_key_exists('statistics_style_loads', $_SESSION))
    $_SESSION['statistics_style_loads'] = array();

  if(in_array($id, $_SESSION['statistics_style_loads']))
    return;
  $_SESSION['statistics_style_loads'][] = $id;

  $sql_id = $stat->escapeString($id);
  $stat->exec("INSERT INTO style_load VALUES ( '{$sql_id}', datetime('now') )");
});

function ajax_list($param) {
  global $stat;
  statistics_check_db();

  $ret = array();
  $res = $stat->query("SELECT style, count(*) c FROM style_load GROUP BY style ORDER BY count(*) DESC LIMIT 40");

  while($elem = $res->fetchArray(SQLITE3_ASSOC))
    $ret[$elem['style']] = $elem;

  return $ret;
}
