// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: 32.9167796, lng: -117.113975 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}

initMap();


function addressToGeocode () {
    const geocodeConverterUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyD1gsa4zv5uIoI49Jw0HZOn2kVv0feSbHg'

    fetch(geocodeConverterUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
    })
}


