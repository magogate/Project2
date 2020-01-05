
function renderHeatMap(data){

  var myMap = L.map("map", {
    center: [33.681113, -83.176415],
    zoom: 9
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  

  var heatArray = [];

  for (var i = 0; i < data.length; i++) {
    var lat = data[i].Start_Lat;
    var lng = data[i].Start_Lng;
    heatArray.push([lat, lng]);
  }
  console.log(heatArray)
  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

}//end of renderHeatMap