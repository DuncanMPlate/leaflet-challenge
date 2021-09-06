base_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function getColor(depth) {
    if (depth <= 10) {
        return "#D1FF33";
    } else if (depth <= 30) {
        return "#EAFF33";
    } else if (depth <= 50) {
        return "#FFF533";
    } else if (depth <= 70) {
        return "#FFCD33";
    } else if (depth <= 90) {
        return "#FF8F33";
    } else {
        return "#FF3633";
    };
};

function getRadius(mag) {
    if (mag <= 1) {
        return 10000;
    } else if (mag <= 2){
        return 25000;
    } else if (mag <= 3){
        return 38000;
    } else if (mag <= 4){
        return 50000;
    } else if (mag <= 5){
        return 6000;
    } else {
        return 80000;
    }
};

d3.json(base_url).then(function (data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
  
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p><br>
                    Magnitude: ${feature.properties.mag}<br>
                    ${new Date(feature.properties.time)}<br>
                    Depth: ${feature.geometry.coordinates[2]} km</p>`)},
  
        pointToLayer: function (feature, location) {
          return new L.circle(location, {
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius:  getRadius(feature.properties.mag),
            fillOpacity: .75,
            stroke: true,
            weight: 1
        })
      }
    }
  );
  createMap(earthquakes);
};

 
function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      42.09, -92.78
    ],
    zoom: 4,
    layers: [street, topo, earthquakes]
  });

  


var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [0, 10, 30, 50, 70, 90],
        labels = ['<strong>Depths(km)</strong>'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
};