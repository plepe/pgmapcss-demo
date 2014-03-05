var ide_current_style;

register_hook("init", function() {
  // Bind IDE to function
  document.getElementById("form").onsubmit = process_form;
});

function process_form(foo) {
  form = document.getElementById("form");

  content = form.elements.mapcss_file.value;
  ajax("save", null, content, function(v) {
    if(!v) {
      alert("An unknown error occured!");
    }

    if(v.status == 0) {
      call_hooks("style_save", v);
    }
    else {
      alert("Error compiling style file:\n" + v.output);
    }
  });

  return false;
}

register_hook("param_change", function(params) {
  if(('style' in params) &&
     (params.style != null) &&
     (ide_current_style != params.style)) {
    var form = document.getElementById("form");
    if(form) {
      form.elements.mapcss_file.value = "";
      form.elements.mapcss_file.disabled = true;
    }

    ajax("load", { 'id': params.style }, null, function(v) {
      if(form)
        form.elements.mapcss_file.disabled = false;

      if(v === null) {
        call_hooks("param_change", { 'style': null });

        update_status();
      }
      else {
        if(form)
          form.elements.mapcss_file.value = v.content;

        if(v.status != 0)
          alert("Error compiling style file:\n" + v.output);
      }

    });

    ide_current_style = params.style;
  }
});
