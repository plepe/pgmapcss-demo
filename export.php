<?
function ajax_export($param) {
  global $data_dir;

  $job_id = sha1(uniqid()) . "." . $param['type'];

  chdir($data_dir);
  shell_exec("mapnik-render-image -b {$param['bbox']} --scale=8000 -o {$job_id} {$param['style']}.mapnik 2>&1 >{$job_id}.debug");

  return $job_id;
}

function ajax_export_done($param) {
  global $data_dir;
  chdir($data_dir);

  if(filesize($param['job']))
    return true;

  return false;
}
