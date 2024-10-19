console.log("Step 1 working");

//Setting up the map object 
let myMap = L.map("map", {
    center : [40.7, -94.5],
    zoom : 3
});

//Adding a tile layer (the background map image) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
    attribution: 
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
}).addTo(myMap);

//Create a link to get the GeoJSON data 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

//Get the GeoJSON data
d3.json(link).then(function(data){
    //Create a function that returns the styled data 
    function styleData(feature){
        return {
           opacity: 1,
           fillOpacity: 1,
           fillColor: getColor(feature.geometry.coordinates[2]),
           color: "green",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    //Create a function for the color of the marker
    function getColor(depth){
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "DarkOrange";
            case depth > 50:
                return "Orange";
            case depth > 30:
                return "Yellow";
            case depth > 10:
                return "GreenYellow";
            default:
                return "Green";
        }
    }
    //Create a function for the radius of the marker based on mag
    function getRadius(magnitude){
        if (magnitude === 0){
            return 1;
        }
        return magnitude *4;
    }
    //Add GeoJson layer to myMap
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleData,
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag 
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
          );
        }
      }).addTo(myMap);
    //Create a legand 
    let legend = L.control({position : "bottomright"});
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        let colors = ["red", "DarkOrange", "Orange", "Yellow", "GreenYellow", "Green"];
    // Loop through the data to generate colored squares
        for (let i =0; i < limits.length; i++){
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " 
            + (limits[i+1] ? "&ndash;" + limits[i+1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(myMap);
});

