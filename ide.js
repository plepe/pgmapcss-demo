register_hook("init", function() {
  // Bind IDE to function
  document.getElementById("form").onsubmit = process_form;
});

function process_form(foo) {
  dom_form = document.getElementById("form");

  content = dom_form.elements.mapcss_file.value;
  ajax("save", null, content, function(v) {
    if(!v) {
      alert("An unknown error occured!");
    }

    if(v.status == 0) {
      ide_current_style = v.id;
      call_hooks("style_save", v);
    }

    alert(v.output);
  });

  return false;
}

register_hook("param_change", function(params) {
  if(('style' in params) &&
     (params.style != null) &&
     (ide_current_style != params.style)) {
    var dom_form = document.getElementById("form");
    if(dom_form) {
      dom_form.elements.mapcss_file.value = "";
      dom_form.elements.mapcss_file.disabled = true;
    }

    ajax("load", { 'id': params.style }, null, function(v) {
      if(dom_form)
        dom_form.elements.mapcss_file.disabled = false;

      if(v === null) {
        call_hooks("param_change", { 'style': null });

        update_status();
      }
      else {
        if(dom_form)
          dom_form.elements.mapcss_file.value = v.content;

        if(v.status != 0)
          alert("Error compiling style file:\n" + v.output);
      }

    });

    ide_current_style = params.style;
  }
});
