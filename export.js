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
var export_job = null;
var export_interval = null;

register_hook("show", function(mode) {
  if(mode != "export")
    return;

  if(export_job !== null)
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

    if(export_job === null) {
      var div = document.getElementById("export");
      while(div.firstChild)
        div.removeChild(div.firstChild);
    }
  }.bind(this, f), f);
});

function export_do(f, input) {
  var param = f.get_data();
  param.style = params.style;

  export_job = true;
  ajax("export", param, null, function(v) {
    if(v === null) {
      alert("An error occured!");
      return;
    }

    export_job = v;
    export_interval = setInterval(function() {
      ajax("export_done", { 'job': export_job }, null, function(v) {
        if(v)
        export_done();
      });
    }, 5000);
  });

  var div = document.getElementById("export");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  div.innerHTML = "Waiting ...";
}

function export_done() {
  clearInterval(export_interval);

  var div = document.getElementById("export");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var a = document.createElement("a");
  a.href = 'download_export.php?job=' + export_job;
  a.target = '_new';
  a.appendChild(document.createTextNode("Download"));
  a.onclick = function() {
    export_job = null;
  };

  div.appendChild(a);

  export_interval = null;
}
