var map;
var wms;
var map_mws_id;
var map_pos;

register_hook("init", function() {
  // create a map in the "map" div, set the view to a given place and zoom
  map = L.map('map').setView([48.21, 16.38], 13);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on('moveend', function(e) {
    History.replaceState(null, null, build_params());
  });

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

  map_wms_id = id;
  History.pushState(null, null, build_params());
}

register_hook("style_save", function(ob) {
  map_change_wms(ob.id);
});

register_hook("param_change", function(params) {
  if('style' in params)
    map_change_wms(params.style);

  if('zoom' in params)
    map.setZoom(params.zoom);

  if('lat' in params && 'lon' in params)
    if((map_pos.lat != params.lat) || (map_pos.lon != params.lon))
        map.panTo([ params.lat, params.lon ]);
});

register_hook("build_params", function(params) {
  params.style = map_wms_id;

  params.zoom = map.getZoom();
  var c = map.getCenter();
  params.lat = c.lat.toFixed(4);
  params.lon = c.lng.toFixed(4);

  map_pos = params;
});
