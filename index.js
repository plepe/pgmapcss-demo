var map;
var wms;

window.onload = function() {
  var m;
  set_mode("map");

  // other parts of the code shall initialize too ...
  call_hooks("init");

  // check initial parameters
  if(m=location.href.match(/^(.*)\?(.*)$/)) {
    params=string_to_hash(m[2]);
    call_hooks("param_change", params);
  }
}.bind(this);

function build_params() {
  var params = {};
  call_hooks("build_params", params);

  var j = [];
  for(var k in params)
    j.push(k + '=' + params[k]);

  return '?' + j.join("&");
}

// Source: http://phpjs.org/functions/urldecode:572
function urldecode (str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

function string_to_hash(str) {
  var ret={};
  var ar=str.split(/&/);
  for(var i=0; i<ar.length; i++) {
    var x=ar[i].split(/=/);
    var k=urldecode(x[0]);
    x.shift();
    ret[k]=urldecode(x.join("="));
  }

  return ret;
}

History.Adapter.bind(window, 'statechange', function() {
  var State = History.getState();
  var m;

  if(m=State.url.match(/^(.*)\?(.*)$/)) {
    params=string_to_hash(m[2]);
    call_hooks("param_change", params);
  }
});

function link(url) {
  return function(url) {
    window.History.pushState(null, null, url);
    set_mode('map');
    return false;
  }.bind(this, url);
}

function set_mode(mode) {
  var old_mode = document.getElementById("form").className.substr(5);
  call_hooks("hide", old_mode);

  document.getElementById("form").className = "mode-" + mode;

  call_hooks("show", mode);
}

function update_status() {
  History.replaceState(null, null, build_params());

  var status = [];
  var tmp;

  if(tmp = map.getZoom())
    status.push("z" + tmp);

  if(tmp = map.getCenter()) {
    if(tmp.lat)
      status.push("Lat: " + tmp.lat.toFixed(4));
    if(tmp.lng)
      status.push("Lon: " + tmp.lng.toFixed(4));
  }

  if(params && params.style)
      status.push("Style: " + params.style);
//map.getZoom() + " Lat: "+ map.getCenter().lat.toFixed(4) + " Lon: " + map.getCenter().lon.toFixed(4);

  document.getElementById("status").innerHTML = status.join(" ");
}
