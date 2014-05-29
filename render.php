<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?

db_check_table('render', 'CREATE TABLE render ( job_id text, style text, bbox text, scale float, timestamp_submit text, timestamp_start text, timestamp_finish text )');

$param = unserialize($argv[1]);

$stat->query("insert into render values ( '{$param['job_id']}', '{$param['style']}', '{$param['bbox']}', '{$param['scale']}', STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'), null )");

$render_param = "";
$render_param .= "-b {$param['bbox']} ";

if($param['width'] || $param['height']) {
  if(!$param['width'])
    $param['width'] = $param['height'];
  if(!$param['height'])
    $param['height'] = $param['width'];

  $render_param .= "--size={$param['width']}x{$param['height']} ";
}
else
  $render_param .= "--scale={$param['scale']} ";

if($param['aspect-fix'])
  $render_param .= "--aspect-fix-mode={$param['aspect-fix']} ";

chdir($data_dir);
$cmd = "mapnik-render-image {$render_param} -o {$param['job_id']} {$param['style']}.mapnik";
file_put_contents("{$param['job_id']}.debug", "$cmd\n");
shell_exec("{$cmd} 2>&1 >>{$param['job_id']}.debug");

$stat->query("update render set timestamp_finish = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') where job_id = '{$param['job_id']}'");

return $job_id;
