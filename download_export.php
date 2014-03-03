<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?php
session_start('pgmapcss-demo');

Header("Content-Type: application/octet-stream");

global $data_dir;
chdir($data_dir);

readfile($_REQUEST['job']);
