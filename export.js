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
var export_form;

register_hook("show", function(mode) {
  if(mode != "export")
    return;

  if(export_job !== null)
    return;

  var div = document.getElementById("export");

  while(div.firstChild)
    div.removeChild(div.firstChild);

  export_form = new form("data", export_form_def);

  export_form.set_data({
    'bbox': map.getBounds().toBBoxString(),
    'scale': 559082264.028 / Math.pow(2, map.getZoom())
  });

  export_form.show(div);

  export_div_status = document.createElement("div");

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export";
  input.onclick = export_do;
  export_div_status.appendChild(input);
  div.appendChild(export_div_status);

  register_hook("map_move", function() {
    export_form.set_data({
      'bbox': map.getBounds().toBBoxString(),
      'scale': 559082264.028 / Math.pow(2, map.getZoom())
    });
  });
  register_hook("hide", function() {
    unregister_hooks_object(export_form);

    if(export_job === null) {
      var div = document.getElementById("export");
      while(div.firstChild)
        div.removeChild(div.firstChild);
    }
  });
});

function export_do(input) {
  if(!export_form.is_complete()) {
    export_form.show_errors();
    return;
  }

  var param = export_form.get_data();
  export_form.reset();
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
    }, 1000);
  });

  export_div_status.innerHTML = "Waiting ...";
}

function export_done() {
  clearInterval(export_interval);

  while(export_div_status.firstChild)
    export_div_status.removeChild(export_div_status.firstChild);

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export again";
  input.onclick = export_do;
  export_div_status.appendChild(input);

  export_div_status.appendChild(document.createTextNode(" "));

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
