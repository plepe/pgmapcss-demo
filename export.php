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
  if($param['width'] && ($param['width'] == ""))
    unset($param['width']);
  elseif($param['width'] && (!preg_match("/^[0-9]+$/", $param['width'])))
    return null;
  if($param['height'] && ($param['height'] == ""))
    unset($param['height']);
  elseif($param['height'] && (!preg_match("/^[0-9]+$/", $param['height'])))
    return null;
  if($param['aspect-fix'] && ($param['aspect-fix'] == ""))
    unset($param['aspect-fix']);
  elseif($param['aspect-fix'] && (!in_array($param['aspect-fix'], array("GROW_BBOX", "GROW_CANVAS", "SHRINK_BBOX", "SHRINK_CANVAS"))))
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
