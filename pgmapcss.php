<?
// use only the first n chars to build an id - as many as are needed to be unique, but at least 5.
function build_id($content) {
  global $data_dir;

  $full_id = sha1($content);

  $char_count = 5;
  $file = "{$data_dir}/" . substr($full_id, 0, $char_count) . ".mapcss";
  while(file_exists($file) && (file_get_contents($file) != $content)) {
    $char_count ++;
    $file = "{$data_dir}/" . substr($full_id, 0, $char_count) . ".mapcss";
  }

  return substr($full_id, 0, $char_count);
}

function compile($id) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $file = "{$id}.mapcss";

  $f=adv_exec("{$pgmapcss['path']} -d'{$db['database']}' -u'{$db['user']}' -p'{$db['password']}' -H'{$db['host']}' -t'{$pgmapcss['template']}' '{$file}'", $data_dir, array());

  if($f[0] != 0)
    $id = null;

  return array(
    'id'=>$id,
    'output'=>$f[1],
    'status'=>$f[0],
  );
}

function ajax_save($param, $content) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $id = build_id($content);
  $file = "{$id}.mapcss";

  // File already exists -> it must have compiled at one point, so leave it 
  // there, even if there's an error compiling
  $no_delete = false;
  if(file_exists("{$data_dir}/{$file}"))
    $no_delete = true;

  file_put_contents("{$data_dir}/{$file}", $content);

  $result = compile($id);

  if($result['status'] != 0) {
    if(!$no_delete)
      unlink("{$data_dir}/{$file}");
  }

  return $result;
}

function ajax_load($param) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $id = $param['id'];
  if(!preg_match('/^[0-9a-z]+$/i', $id))
    return "WRONG ID!";

  $file = "{$id}.mapcss";
  compile($id);

  return file_get_contents("{$data_dir}/{$file}");
}
