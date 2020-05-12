var urlParams = new URLSearchParams(window.location.search);
var token = urlParams.get('token');

// generate a valid layer name
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = yyyy + mm + dd;
var layer_name = 'sof-d/YYYYMMDD/00/t2m:K'
layer_name = layer_name.replace('YYYYMMDD', today);

// submit button handler
document.getElementById('options').onsubmit = function(e) {
  e.preventDefault()
  // set CRS
  var use4326 = document.getElementById('epsg4326').checked;
  if (use4326) {
    createMap('EPSG:4326');
  } else {
    createMap('EPSG:3857');
  }
  // add WMS
  var tiled = document.getElementById('tiled').checked;
  if (tiled) {
    tileLayer();
  } else {
    imageLayer();
  }
}

////////////////////
/// Build the Map //
////////////////////

function createMap(projection) {
  window.ol_map = null;
  document.getElementById('map').innerHTML = null;
  // create map
  window.ol_map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: projection,
      center: [0, 0],
      zoom: 1
    })
  });
}

function tileLayer() {
  window.SpireWMSLayer = new ol.layer.Tile({
    opacity: 0.7,
    source: new ol.source.TileWMS({
      url: 'https://api.wx.spire.com/ows/wms/?bundle=basic&spire-api-key=' + token,
      params: {'LAYERS': layer_name},
      serverType: 'mapserver',
      //serverType: 'geoserver', // this works too...
    })
  });
  window.ol_map.addLayer(window.SpireWMSLayer);
}

function imageLayer() {
  window.SpireWMSLayer = new ol.layer.Image({
    opacity: 0.7,
    source: new ol.source.ImageWMS({
      url: 'https://api.wx.spire.com/ows/wms/?bundle=basic&spire-api-key=' + token,
      params: {'LAYERS': layer_name},
      serverType: 'mapserver',
      //serverType: 'geoserver', // this works too...
    })
  });
  window.ol_map.addLayer(window.SpireWMSLayer);
}

// initialize
createMap('EPSG:3857');
imageLayer();
