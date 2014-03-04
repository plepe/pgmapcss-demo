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

function file_path($id) {
  global $data_dir;

  return array(
    'name' => "{$id}.mapcss",
    'path' => $data_dir,
  );
}

function compile($id) {
  global $pgmapcss;
  global $db;

  $file = file_path($id);

  $f=adv_exec("{$pgmapcss['path']} -d'{$db['database']}' -u'{$db['user']}' -p'{$db['password']}' -H'{$db['host']}' -t'{$pgmapcss['template']}' '{$file['name']}' 2>&1", $file['path'], array());

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

  $id = build_id($content);
  $file = file_path($id);

  // File already exists -> it must have compiled at one point, so leave it 
  // there, even if there's an error compiling
  $no_delete = false;
  if(file_exists("{$file['path']}/{$file['name']}"))
    $no_delete = true;

  file_put_contents("{$file['path']}/{$file['name']}", $content);

  $result = compile($id);

  if($result['status'] != 0) {
    if(!$no_delete)
      unlink("{$file['path']}/{$file['name']}");
  }

  call_hooks("load", $id);

  return $result;
}

function ajax_load($param) {
  global $pgmapcss;
  global $db;
  global $data_dir;

  $id = $param['id'];
  if(!preg_match('/^[0-9a-z]+$/i', $id))
    return "WRONG ID!";

  $file = file_path($id);

  if(!file_exists("{$file['path']}/{$file['name']}"))
    return null;

  compile($id);

  call_hooks("load", $id);

  return file_get_contents("{$file['path']}/{$file['name']}");
}
