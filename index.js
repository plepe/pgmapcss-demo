var map;
var wms;

window.onload = function() {
  var m;

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

History.Adapter.bind(window,'statechange',function() {
  var State = History.getState();
  var m;

  if(m=State.url.match(/^(.*)\?(.*)$/)) {
    params=string_to_hash(m[2]);
    call_hooks("param_change", params);
  }
});
