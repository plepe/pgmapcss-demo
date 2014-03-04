<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?

db_check_table('render', 'CREATE TABLE render ( job_id text, style text, bbox text, scale float, timestamp_submit text, timestamp_start text, timestamp_finish text )');

$param = unserialize($argv[1]);

$stat->query("insert into render values ( '{$param['job_id']}', '{$param['style']}', '{$param['bbox']}', '{$param['scale']}', STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'), null )");

chdir($data_dir);
shell_exec("mapnik-render-image -b {$param['bbox']} --scale={$param['scale']} -o {$param['job_id']} {$param['style']}.mapnik 2>&1 >{$param['job_id']}.debug");

$stat->query("update render set timestamp_finish = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') where job_id = '{$param['job_id']}'");

return $job_id;
