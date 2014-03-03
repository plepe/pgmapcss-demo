var export_form_def = {
  'type': {
    'name': "Type",
    'type': 'select',
    'values': { 'pdf': "PDF", 'svg': "SVG", 'png': "PNG", 'jpg': "JPG" }
  }
};

register_hook("show", function(mode) {
  if(mode != "export")
    return;

  var div = document.getElementById("export");

  while(div.firstChild)
    div.removeChild(div.firstChild);

  var f = new form("data", export_form_def);
  f.show(div);

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export";
  input.onclick = export_do.bind(this, f);
  div.appendChild(input);
});

function export_do(f) {
  alert(JSON.stringify(f.get_data(), null, '  '));
}
