<?
function ajax_save($param, $content) {
  $id = 't' . uniqid();
  $file = "{$id}.mapcss";

  file_put_contents("data/{$file}", $content);
  $f=adv_exec("pgmapcss -dskunk -uskunk -pPASSWORD -Hlocalhost -tmapnik-2.2 \"{$file}\"", "data/", array());

  if($f[0] != 0) {
    unlink("data/{$file}");
    $id = null;
  }

  return array(
    'id'=>$id,
    'output'=>$f[1],
    'status'=>$f[0],
  );
}

function ajax_load($param) {
  $id = $param['id'];
  if(!preg_match('/^[0-9a-z]+$/i', $id))
    return "WRONG ID!";

  $file = "{$id}.mapcss";
  // in case we re-initialized the database, compile again
  $f=adv_exec("pgmapcss -dskunk -uskunk -pPASSWORD -Hlocalhost -tmapnik-2.2 \"{$file}\"", "data/", array());

  return file_get_contents("data/{$file}");
}
