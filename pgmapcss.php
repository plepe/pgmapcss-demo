<?php
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
    'id' => $id,
    'name' => "{$id}.mapcss",
    'path' => $data_dir,
  );
}

function bash_escape($str) {
  return "'" . strtr($str, array(
          "'"   => "'\''",
      )) . "'";
}

function compile($id, $param=array()) {
  global $pgmapcss;
  global $db;
  $add_param = "";

  $file = file_path($id);

  if($param['defaults'])
      $add_param .= " --defaults=" . bash_escape($param['defaults']);
  if($pgmapcss['parameters'])
      $add_param .= " ". $pgmapcss['parameters'];

  $f=adv_exec("{$pgmapcss['path']} $add_param -d'{$db['database']}' -u'{$db['user']}' -p'{$db['password']}' -H'{$db['host']}' -t'{$pgmapcss['template']}' '{$file['name']}' 2>&1", $file['path'], array("LC_CTYPE"=>"en_US.UTF-8"));

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
  file_put_contents("{$file['path']}/{$file['id']}.param", json_encode($param));

  $result = compile($id, $param);

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
  $param = array();
  if(file_exists("{$file['path']}/{$file['id']}.param"))
    $param = json_decode(file_get_contents("{$file['path']}/{$file['id']}.param"), true);

  $result = compile($id, $param);

  call_hooks("load", $id);

  $result['content'] = file_get_contents("{$file['path']}/{$file['name']}");
  $result['param'] = $param;

  return $result;
}
