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
  if(('style' in params) && (ide_current_style != params.style))
    ajax("load", { 'id': params.style }, null, function(data) {
      var form = document.getElementById("form");

      if(data === null) {
        form.elements.mapcss_file.value = "";
        call_hooks("param_change", { 'style': null });
      }
      else {
        form.elements.mapcss_file.value = data;
      }

    });

  ide_current_style = params.style;
});
