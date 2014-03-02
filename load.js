register_hook("show", function(mode) {
  if(mode != "load")
    return;

  var div = document.getElementById("load-list");
  div.innerHTML = "Loading ...";

  ajax("list", null, null, function(v) {
    var ul = document.createElement("ul");

    for(var i in v) {
      var li = document.createElement("li");
      var a = document.createElement("a");

      a.href = "?style=" + i;
      a.onclick = link("?style=" + i);

      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
    }

    while(div.firstChild)
      div.removeChild(div.firstChild);

    div.appendChild(ul);
  });
});
