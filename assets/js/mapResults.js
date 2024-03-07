// Initialize and add the map
let map;


const searchedCityLat = Number(localStorage.getItem('searchedCityLatitude'))
const searchedCityLon = Number(localStorage.getItem('searchedCityLongitude'))

console.log(searchedCityLat, searchedCityLon);

console.log(typeof searchedCityLat);

let breweryLat = 32.71667995
let breweryLon = -117.1608785

async function initMap() {
  // The location of Uluru
  const position = { lat: searchedCityLat, lng: searchedCityLon };

  // const savedBreweryList = JSON.parse(localStorage.getItem(`searchedBreweryList`))
  // for (let i = 0; i < savedBreweryList.length; i++) {
  //   const eachLat = savedBreweryList[i].breweryLatitude;
  //   const eachLon = savedBreweryList[i].breweryLongitude;
  //   let position = { lat: eachLat , lng: eachLon}
    
  


  let position2 = { lat: breweryLat, lng: breweryLon }
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: position,
    mapId: "hello",

  });
  
  let markers = [
    ['SearchLocation', searchedCityLat,searchedCityLon],
    ['Brewery1', breweryLat, breweryLon]
  ]

  for (let i = 0; i < markers.length; i++) {
    let position = new google.maps.LatLng(markers[i][1], markers[i][2])
    marker = new AdvancedMarkerElement({
      position: position,
      map: map,
      title: markers[i][0]
    })

        // The marker, positioned at Uluru
        // const marker = new AdvancedMarkerElement({
        //   map: map,
        //   position: position,
        //   title: "Uluru",
        // });

        // const marker2 = new AdvancedMarkerElement({
        //   map: map,
        //   position: position2,
        //   title: "Brewery1"
        // })
  }
}

initMap()



// function addressToGeocode () {
//   const geocodeConverterUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyD1gsa4zv5uIoI49Jw0HZOn2kVv0feSbHg'

//   fetch(geocodeConverterUrl).then(function(response) {
//       return response.json();
//   })
//   .then(function(data) {
//       console.log(data)
//   })
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////

// function initMap() {
//   let map;
//   let bounds = new google.maps.LatLngBounds();
//   let mapOptions = {
//     mapTypeId: 'Search Results'
//   }

//   map = new google.maps.Map(document.getElementById('map'), mapOptions);
//   map.setTilt(50);

//   let markers = [
//     ['A', 40.671349546, -73.9637573],
//     ['B', 40.67254944, -73.96821621],
//     ['C', 40.66427511, -73.96512605]
//   ];

//   // info window content
//   let infoWindowContent = [
//     ['<div class="info_content">' +
//       '<h2>A</h2>' +
//       `<h3>address here</h3>` +
//       `<p>explanation here</p>`],
//       ['<div class="info_content">' +
//       '<h2>A</h2>' +
//       `<h3>address here</h3>` +
//       `<p>explanation here</p>`],
//       ['<div class="info_content">' +
//       '<h2>A</h2>' +
//       `<h3>address here</h3>` +
//       `<p>explanation here</p>`]
//   ];

//   // add multiple markers to map

//   let infoWindow = new google.maps.InfoWindow(), marker, i;

//   for (let i = 0; i < markers.length; i++) {
//     let position = new google.maps.LatLng(markers[i][1], markers[i][2])
//     bounds.extend(position);
//     marker = new google.maps.marker.AdvancedMarkerElement({
//       position: position,
//       map: map,
//       title: markers[i][0]
//     })

//     // add info window to marker
//     google.maps.event.addListener(marker, 'click', (function(marker, i) {
//       return function () {
//           infoWindow.setContent(infoWindowContent[i][0])
//           infoWindow.open(map, marker)
//       }
//     })(marker, i))

//     map.fitBounds(bounds)
    
//   }

//   let boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
//     this.setZoom(14);
//     google.maps.event.removeListener(boundsListener)
//   })
// }

// window.initMap()
