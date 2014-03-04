var export_form_def = {
  'type': {
    'name': "Type",
    'type': 'select',
    'values': { 'pdf': "PDF", 'svg': "SVG", 'png': "PNG", 'jpg': "JPG" },
    'req': true
  },
  'bbox': {
    'name': "Bounding Box",
    'type': 'textarea',
    'check': [ "regexp", "^\-?[0-9]+(\.[0-9]+)?,\-?[0-9]+(\.[0-9]+)?,\-?[0-9]+(\.[0-9]+)?,\-?[0-9]+(\.[0-9]+)?$", "Expecting four coordinates, separated by colon." ],
    'html_attributes': { 'style': 'min-height: 0;' }
  },
  'scale': {
    'name': "Scale",
    'type': 'float'
  }
};
var export_job = null;
var export_interval = null;
var export_div_status = null;

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
    'bbox': map.getBounds().toBBoxString(),
    'scale': 559082264.028 / Math.pow(2, map.getZoom())
  });

  f.show(div);

  export_div_status = document.createElement("div");

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export";
  input.onclick = export_do.bind(this, f);
  export_div_status.appendChild(input);
  div.appendChild(export_div_status);

  register_hook("map_move", function(f) {
    f.set_data({
      'bbox': map.getBounds().toBBoxString(),
      'scale': 559082264.028 / Math.pow(2, map.getZoom())
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
  if(!f.is_complete()) {
    f.show_errors();
    return;
  }

  var param = f.get_data();
  f.reset();
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

  export_div_status.innerHTML = "Waiting ...";
}

function export_done() {
  clearInterval(export_interval);

  while(export_div_status.firstChild)
    export_div_status.removeChild(export_div_status.firstChild);

  var a = document.createElement("a");
  a.href = 'download_export.php?job=' + export_job;
  a.target = '_new';
  a.appendChild(document.createTextNode("Download"));
  a.onclick = function() {
    export_job = null;
  };

  export_div_status.appendChild(a);

  export_interval = null;
}
