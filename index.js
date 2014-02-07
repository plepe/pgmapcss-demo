window.onload = function() {
  // create a map in the "map" div, set the view to a given place and zoom
  var map = L.map('map').setView([48.21, 16.38], 13);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // WMS tilelayer
  var wms = L.tileLayer.wms("http://192.168.0.130:8000/", {
    layers: '__all__',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

}.bind(this);
