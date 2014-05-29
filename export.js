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
  'width': {
    'type': 'integer',
    'name': "Width (pixels)",
    'desc': "if empty it will be automatically calculated from scale"
  },
  'height': {
    'type': 'integer',
    'name': "Height (pixels)",
    'desc': "if empty it will be automatically calculated from scale"
  },
  'scale': {
    'name': "Scale",
    'type': 'float',
    'desc': "ignored when <i>width</i> or <i>height</i> are given"
  },
  'aspect-fix': {
    'name': "Aspect fix mode",
    'type': 'select',
    'values': [ 'GROW_BBOX', 'GROW_CANVAS', 'SHRINK_BBOX', 'SHRINK_CANVAS' ],
    'default': 'GROW_BBOX'
  }
};
var export_job = null;
var export_interval = null;
var export_div_status = null;
var export_form;
var export_bbox;

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

  export_form.onchange = function() {
    var d = export_form.get_data();

    if(export_bbox) {
      d = d['bbox'].split(',');
      var b = L.latLngBounds(L.latLng(parseFloat(d[1]), parseFloat(d[0])), L.latLng(parseFloat(d[3]), parseFloat(d[2])));
      export_bbox.setBounds(b);
    }
  };

  if(L.LocationFilter) {
    if(!export_bbox) {
      export_bbox = new L.LocationFilter();

      // when creating bbox object set to map bounds minus 20%
      export_bbox.setBounds(map.getBounds().pad(-0.2));
    }

    export_bbox.addTo(map);
    export_bbox.enable();
    export_bbox.on("change", function(e) {
      export_form.set_data({
        'bbox': export_bbox.getBounds().toBBoxString()
      });
    });
    export_bbox.on("disabled", function() {
      export_form.set_data({ 'bbox': map.getBounds().toBBoxString() });
    });
    export_bbox.on("enabled", function() {
      export_form.set_data({ 'bbox': export_bbox.getBounds().toBBoxString() });
    });
  }

  export_form.show(div);

  export_div_status = document.createElement("div");

  var input = document.createElement("input")
  input.type = "button";
  input.value = "Export";
  input.onclick = export_do;
  export_div_status.appendChild(input);
  div.appendChild(export_div_status);

  register_hook("map_move", function() {
    var new_data = {
      'scale': 559082264.028 / Math.pow(2, map.getZoom())
    };

    if((!export_bbox) || (!export_bbox.isEnabled()))
      new_data.bbox = map.getBounds().toBBoxString();

    export_form.set_data(new_data);
  });
  register_hook("hide", function() {
    unregister_hooks_object(export_form);

    if(export_job === null) {
      var div = document.getElementById("export");
      while(div.firstChild)
        div.removeChild(div.firstChild);
    }

    if(export_bbox) {
      map.removeLayer(export_bbox);
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
