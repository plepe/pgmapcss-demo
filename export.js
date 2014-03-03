var export_form_def = {
  'type': {
    'name': "Type",
    'type': 'select',
    'values': { 'pdf': "PDF", 'svg': "SVG", 'png': "PNG", 'jpg': "JPG" }
  },
  'bbox': {
    'name': "Bounding Box",
    'type': 'text',
  }
};

register_hook("show", function(mode) {
  if(mode != "export")
    return;

  var div = document.getElementById("export");

  while(div.firstChild)
    div.removeChild(div.firstChild);

  var f = new form("data", export_form_def);

  f.set_data({
    'bbox': map.getBounds().toBBoxString()
  });

  f.show(div);

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export";
  input.onclick = export_do.bind(this, f);
  div.appendChild(input);

  register_hook("map_move", function(f) {
    f.set_data({
      'bbox': map.getBounds().toBBoxString()
    });
  }.bind(this, f), f);
  register_hook("hide", function(f) {
    unregister_hooks_object(f);

    var div = document.getElementById("export");
    while(div.firstChild)
      div.removeChild(div.firstChild);
  }.bind(this, f), f);
});

function export_do(f) {
  alert(JSON.stringify(f.get_data(), null, '  '));
}
