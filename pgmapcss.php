<?
function ajax_save($param, $content) {
  $id = 't' . uniqid();

  file_put_contents("data/{$id}.mapcss", $content);
  chdir("data/");
  $f=popen("pgmapcss -dskunk -uskunk -pPASSWORD -Hlocalhost -tmapnik-2.2 {$id}.mapcss", "r");

  $ret = "";
  while($r=fgets($f))
    $ret .= $r;

  $status = pclose($f);

  return array(
    'id'=>$id,
    'output'=>$ret,
    'status'=>$status,
  );
}
