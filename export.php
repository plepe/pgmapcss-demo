<?
function ajax_export($param) {
  // check params
  if(!in_array($param['type'], array("png", "svg", "pdf", "jpg")))
    return null;
  if(!preg_match("/^[0-9\.,]+$/", $param['bbox']))
    return null;
  if(!preg_match("/^[a-z0-9]+$/", $param['style']))
    return null;
  if(!preg_match("/^[a-z0-9\.]+$/", $param['scale']))
    return null;

  $param['job_id'] = sha1(uniqid()) . "." . $param['type'];

  shell_exec("php render.php '" . serialize($param) . "' 2>/dev/null >/dev/null&");

  return $param['job_id'];
}

function ajax_export_done($param) {
  global $data_dir;
  chdir($data_dir);

  if(!preg_match("/^[a-z0-9][a-z0-9\.]+$/", $param['job']))
    return null;

  if(filesize($param['job']))
    return true;

  return false;
}
