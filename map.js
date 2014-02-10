var map;
var wms;
var map_mws_id;

register_hook("init", function() {
  // create a map in the "map" div, set the view to a given place and zoom
  map = L.map('map').setView([48.21, 16.38], 13);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map_wms_id = null;
});

function map_change_wms(id) {
  if(map_wms_id == id)
    return;

  if(wms)
      map.removeLayer(wms);

  // WMS tilelayer
  wms = L.imageOverlay.wms("http://192.168.0.130:8000/", {
    layers: id,
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  History.pushState(null, null, '?style=' + id);
  map_wms_id = id;
}

register_hook("style_save", function(ob) {
  map_change_wms(ob.id);
});

register_hook("param_change", function(params) {
  if('style' in params)
    map_change_wms(params.style);
});
