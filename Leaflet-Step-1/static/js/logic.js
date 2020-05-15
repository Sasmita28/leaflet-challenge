// Creating myMap object
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,

});

// Creating tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: 'mapbox.light',
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" ;

// function for choosing color depending upon the magnitude

function chooseColor(magnitude){
  if (magnitude > 5) {
    var color = "red";
  }
  else if(magnitude > 4) {
    var color = "orange";
  }

  else if (magnitude > 3) {
    var color = "gold";
  }

  else if (magnitude > 2) {
    var color = "yellow";
  }
  else if (magnitude > 1) {
    var color = "yellowgreen";
  }
  else {
    var color = "lightgreen";
  }

  return color;
}

// to increase the markersize for shaping our radius of the circle marker
function markerSize(magnitude) {
  return magnitude* 1500;
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  console.log(data.features);

  var feature = data.features;

  for (var i=0; i < feature.length; i++){ 

  var location = feature[i].geometry;

  // circle markers with pop up
    L.circle([location.coordinates[1], location.coordinates[0]], {
      fillOpacity: 0.85,
      weight: 0.5,
      color : "grey",
      fillColor:chooseColor(feature[i].properties.mag),
      radius: markerSize(feature[i].properties.mag)*10})
      .bindPopup("<h3>" + feature[i].properties.place +
            "</h3><h3>" + feature[i].properties.mag + "</h3>").addTo(myMap);
  
  }
  // creating  legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    
    var grades = [0, 1, 2, 3, 4, 5];

   
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };


  legend.addTo(myMap);

});





  
