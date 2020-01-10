//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

var heat;

// https://docs.mapbox.com/api/maps/#styles
// Create the tile layer that will be the background of our map
var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {  
  maxZoom: 18,
  id: "mapbox.outdoors-v11",
  accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {  
  maxZoom: 18,
  id: "mapbox.light-v9",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {  
  maxZoom: 18,
  id: "mapbox.satellite-v9",
  accessToken: API_KEY
});

var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
})//.addTo(myMap);


// Only one base layer can be shown at a time
var baseMaps = {
  Satellite: satellite,
  Outdoor: lightmap,
  Grayscale: grayscalemap,
  Street: streets
};

// https://github.com/Leaflet/Leaflet.fullscreen
var myMap = L.map("map", {
    center: [33.681113, -83.176415],
    zoom: 9,
    fullscreenControl: {
      pseudoFullscreen: false // if true, fullscreen to page width and height
    }
  });

streets.addTo(myMap)
  // Load in geojson data
  var geoData = "data/Counties_Georgia.geojson";

  var geojson;

function renderChoropleth(){
  // console.log("Inside renderChoropleth")
  // Grab data with d3
  // d3.json(geoData, function(data) {
    var geojson = [];
  d3.json(geoData).then(function(data, err) {
    // console.log("Inside D3 of chropleth");
    // console.log(data);
    // Create a new choropleth layer
    geojson.push(L.choropleth(data, {
  
        // Define what  property in the features to use
        valueProperty: "Label",
        // Set color scale
        // scale: ["#ffffb2", "#b10026"],
        
        // Number of breaks in step range
        steps: 0,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "black",
          weight: 0.2,
          fillOpacity: 0.1
        },
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup("County: " + feature.properties.NAMELSAD10);
        }
      })
    )//.addTo(myMap);  

      var geojsonLayer = L.layerGroup(geojson);

      // geojsonLayer.addTo(myMap);

      var overlayMaps = {
        GeoJLayer: geojsonLayer,
        HeatLayer: heat
      };

      // Add the layer control to the map
      // https://stackoverflow.com/questions/45092237/make-leaflet-layers-control-with-checkboxes-not-radio-buttons
      L.control.layers(null, overlayMaps).addTo(myMap); 

  })//end of d3 json

  
}//end of renderChoropleth

function renderHeatMap(data){
  // removeMap();
  d3.select("#map").select("canvas").remove()

  var heatArray = [];

  for (var i = 0; i < data.length; i++) {
    var lat = data[i].Start_Lat;
    var lng = data[i].Start_Lng;
    heatArray.push([lat, lng]);
  }
  // console.log(heatArray)
   heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

}//end of renderHeatMap