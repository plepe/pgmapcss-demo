register_hook("init", function() {
  // Bind IDE to function
  document.getElementById("ide").onsubmit = process_form;
});

function process_form(foo) {
  form = document.getElementById("ide");

  content = form.elements.mapcss_file.value;
  ajax("save", null, content, function(v) {
    call_hooks("style_save", v);
  });

  return false;
}
