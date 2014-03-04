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
    update_status();

    call_hooks("map_move");
  });

  map_wms_id = null;
});

function map_change_wms(id) {
  if(map_wms_id == id)
    return;

  if(wms) {
      wms.wmsParams.layers = id;

      map.removeLayer(wms);
      wms.addTo(map);
  }
  else {
    if(config.wms.type == 'single') {
      // WMS singlelayer
      wms = L.imageOverlay.wms(config.wms.base_url, {
        layers: id,
        format: 'image/png',
        transparent: true,
      }).addTo(map);
    }
    else if(config.wms.type == 'tiled') {
      // WMS tilelayer
      wms = L.tileLayer.wms(config.wms.base_url, {
        layers: id,
        format: 'image/png',
        transparent: true,
        tileSize: config.wms.tileSize || 256,
        reuseTiles: true
      }).addTo(map);
    }
  }

  if('attribution' in config.wms) {
    if(typeof(config.wms.attribution) == "object")
      for(var i = 0; i < config.wms.attribution.length; i++)
        map.attributionControl.addAttribution(config.wms.attribution[i]);
    else
      map.attributionControl.addAttribution(config.wms.attribution);
  }
  else
    map.attributionControl.addAttribution('&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors');

  if('attribution_prefix' in config.wms) {
    map.attributionControl.setPrefix(config.wms.attribution_prefix);
  }

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
  if(map_wms_id)
    params.style = map_wms_id;

  params.zoom = map.getZoom();
  var c = map.getCenter();
  params.lat = c.lat.toFixed(4);
  params.lon = c.lng.toFixed(4);

  map_pos = params;
});
