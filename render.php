<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?
$param = unserialize($argv[1]);

chdir($data_dir);
shell_exec("mapnik-render-image -b {$param['bbox']} --scale={$param['scale']} -o {$param['job_id']} {$param['style']}.mapnik 2>&1 >{$param['job_id']}.debug");

return $job_id;
