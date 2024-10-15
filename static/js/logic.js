//Setting up the map object 
let myMap = L.map("map", {
    center : [50.1881, -80.1406, 10],
    zoom : 1
});

//Adding a tile layer (the background map image) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Create a link to get the GeoJSON data 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

//Get the GeoJSON data
d3.json(link).then(function(data){
    //Create a GeoJSON layer with the retrieved data 
    //L.geoJson(data).addTo(myMap);
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "size: "
            + feature.properties.mag
            + "<br>Dt: "
            + feature.geometry.coordinates[2]
            + "<br>Rt: "
            + feature.properties.place
          );
        }
      }).addTo(map);
});

//Define the marker size by the magnitude of the earthquake
function createMarkers(data){
    //Pull the magnitude  property from the response.data
    //let magnitudes = data.features.properties.mag;
    

    //Initialize an array to hold magitude markers
    let magMarkers = [];

    //Loop through the magnitude array 
    //for (let index = 0; index < magnitudes.length; index++){
        //let magnitude = magnitudes[index];
    data.features.forEach(function(feature) {
        let magnitude = feature.properties.mag;
        let coordinates = feature.geometry.coordinates;
        //For each magnitude, create a marker 
        let magMarker = L.circleMarker([coordinates[1], coordinates[0]], { radius: magnitude * 3, color: "blue", fillOpacity: 0.6 });


        //Add the market to the magMarkers array 
        magMarkers.push(magMarker);
    });
    //Create a layer group for magMarkers and pass to myMap

   L.addTo(myMap);
}