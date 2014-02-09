var map;
var wms;

register_hook("init", function() {
  // create a map in the "map" div, set the view to a given place and zoom
  map = L.map('map').setView([48.21, 16.38], 13);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
});

register_hook("style_save", function(ob) {
  if(wms)
      map.removeLayer(wms);

  // WMS tilelayer
  wms = L.imageOverlay.wms("http://192.168.0.130:8000/", {
    layers: ob.id,
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
});
