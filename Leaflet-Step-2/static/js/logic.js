
// Creating layers
// creating satellitemap layer
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,

  id: 'mapbox.satellite',
  accessToken: API_KEY
});

// creating grayscalemap layer
var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: 'mapbox.light',
  accessToken: API_KEY

});
// creating outdoorsmap layer
var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: 'mapbox.outdoors',
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
  "Satellite": satellitemap,
  "Grayscale": grayscalemap,
  "Outdoors": outdoorsmap
};


// function to choose color depending upon magnitude
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

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" ;

// Store our tectonicplate boundary json inside plateUrl
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  d3.json(plateUrl,function(plateData){


    // console.log(plateData);
 
    // creating earthquake layer
    var earthquakes = L.geoJSON(data, {

      // Create circle markers
      pointToLayer: function (feature, latlng) {
        var circleMarkers = {
          
          radius: markerSize(feature.properties.mag)*20,
          fillColor: chooseColor(feature.properties.mag),
          color:"grey",
          weight: 0.5,
          fillOpacity: .8
        };
        return L.circle(latlng, circleMarkers);
      },

      // Create popups
      onEachFeature: function (feature, layer) {
        
        return layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><h3>" + feature.properties.mag + "</h3>")
      }
    });


        
    // creating plateBoundary layer
    var plateBoundary = L.geoJSON(plateData, {
      "color": "orange"
    });
  
  
 
    // Define a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [satellitemap, plateBoundary, earthquakes]
    });

    // creating overlayMaps with earthquakes and plateBoundary Layer
    var overlayMaps = {
      "Fault lines": plateBoundary,
      "Earthquakes": earthquakes,
    };

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // creating legend
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
})


});




