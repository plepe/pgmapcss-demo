<?
function build_id($content) {
  return 't' . sha1($content);
}

function ajax_save($param, $content) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $id = build_id($content);
  $file = "{$id}.mapcss";

  file_put_contents("{$data_dir}/{$file}", $content);
  $f=adv_exec("{$pgmapcss['path']} -d'{$db['database']}' -u'{$db['user']}' -p'{$db['password']}' -H'{$db['host']}' -t'{$pgmapcss['template']}' '{$file}'", $data_dir, array());

  if($f[0] != 0) {
    unlink("{$data_dir}/{$file}");
    $id = null;
  }

  return array(
    'id'=>$id,
    'output'=>$f[1],
    'status'=>$f[0],
  );
}

function ajax_load($param) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $id = $param['id'];
  if(!preg_match('/^[0-9a-z]+$/i', $id))
    return "WRONG ID!";

  $file = "{$id}.mapcss";
  // in case we re-initialized the database, compile again
  $f=adv_exec("{$pgmapcss['path']} -d'{$db['database']}' -u'{$db['user']}' -p'{$db['password']}' -H'{$db['host']}' -t'{$pgmapcss['template']}' '{$file}'", $data_dir, array());

  return file_get_contents("{$data_dir}/{$file}");
}
