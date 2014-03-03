<?
function ajax_export($param) {
  global $data_dir;

  // check params
  if(!in_array($param['type'], array("png", "svg", "pdf", "jpg")))
    return null;
  if(!preg_match("/^[0-9\.,]+$/", $param['bbox']))
    return null;
  if(!preg_match("/^[a-z0-9]+$/", $param['style']))
    return null;

  $job_id = sha1(uniqid()) . "." . $param['type'];

  chdir($data_dir);
  shell_exec("mapnik-render-image -b {$param['bbox']} --scale=8000 -o {$job_id} {$param['style']}.mapnik 2>&1 >{$job_id}.debug");

  return $job_id;
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
