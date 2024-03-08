// Initialize and add the map
let map;


const searchedCityLat = Number(localStorage.getItem('searchedCityLatitude'))
const searchedCityLon = Number(localStorage.getItem('searchedCityLongitude'))

console.log(searchedCityLat, searchedCityLon);

console.log(typeof searchedCityLat);

async function initMap() {

  const position = { lat: searchedCityLat, lng: searchedCityLon };

  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: position,
    mapId: "brews-grooves",

  });

  // load Brewery markers
  let savedMarkersBrewery = loadFromSavedListBrewery()
  let markersBrewery = savedMarkersBrewery

  for (let i = 0; i < markersBrewery.length; i++) {
    let position = new google.maps.LatLng(markersBrewery[i][1], markersBrewery[i][2])
    const label = `${[i+1]}`
    const pinGlyph = new PinElement( {
      glyph: label,
      glyphColor: "white",
    })
    const marker = new AdvancedMarkerElement({
      position: position,
      map,
      title: markersBrewery[i][0],
      content: pinGlyph.element,
    })
  }
  
  // load Event markers
  let savedMarkersEvents = loadFromSavedListEvents()
  let markersEvents = savedMarkersEvents

  for (let i = 0; i < markersEvents.length; i++) {
    let position = new google.maps.LatLng(markersEvents[i][1], markersEvents[i][2])
    const label = `${[i+1]}`
    const pinGlyph = new PinElement( {
      glyph: label,
      glyphColor: "white",
      background: "#1B9CFC",
      borderColor: "white"
    })
    const marker = new AdvancedMarkerElement({
      position: position,
      map,
      title: markersEvents[i][0],
      content: pinGlyph.element,
    })
  }


}

function loadFromSavedListBrewery() {
  const savedBreweryList = JSON.parse(localStorage.getItem('searchedBreweryList'))
  let markerList = []
  for (let i = 0; i < savedBreweryList.length; i++) {
    markerListToAdd = [savedBreweryList[i].breweryName, Number(savedBreweryList[i].breweryLatitude), Number(savedBreweryList[i].breweryLongitude)]
    markerList.push(markerListToAdd)
    
  }
  // console.log(markerList);
  return markerList
}

function loadFromSavedListEvents() {
  const savedEventList = JSON.parse(localStorage.getItem('searchedEventList'))
  let markerList = []
  for (let i = 0; i < savedEventList.length; i++) {
    markerListToAdd = [savedEventList[i].eventName, Number(savedEventList[i].eventLat), Number(savedEventList[i].eventLon)]
    markerList.push(markerListToAdd)
  }
  // console.log(markerList);
  return markerList
}

function reformatPhone(num) {
    
  if (num === null) {
      // do nothing
  } else {
      let numVal = num.replace(/\D[^\.]/g, "")
      num = numVal.slice(0,3)+"-"+numVal.slice(3,6)+"-"+numVal.slice(6)
      return num
  }
}

function renderLists() {
  const savedBreweryList = JSON.parse(localStorage.getItem('searchedBreweryList'))
  for (let i = 0; i < savedBreweryList.length; i++) {
    let savedBreweryUrl = ''
    if (savedBreweryList[i].breweryWebsite == null) {
      savedBreweryUrl = " "
    } else {
      savedBreweryUrl = savedBreweryList[i].breweryWebsite
    }
    let savedBreweryPhone = ''
    if (savedBreweryList[i].breweryPhone == null) {
      savedBreweryPhone = ' '
    } else {
      savedBreweryPhone = savedBreweryList[i].breweryPhone
    }

    const breweryList = $('<a>')
    breweryList.addClass('collection-item')
    breweryList.attr('href', savedBreweryUrl)
    breweryList.attr('id', 'opacity')
    breweryList.attr('target', '_blank')
    breweryList.text(`${savedBreweryList[i].breweryName} - Phone: ${savedBreweryPhone}`)

    $('#brewery-list-brief').append(breweryList)
    
  }

  const savedEventList = JSON.parse(localStorage.getItem('searchedEventList'))
  for (let i = 0; i < savedEventList.length; i++) {
    let savedPromoterUrl = ''
    if (savedEventList[i].eventPromotorUrl == null) {
      savedPromoterUrl = ''
    } else {
      savedPromoterUrl = savedEventList[i].eventPromotorUrl
    }

    let savedTicketmasterUrl = ''
    if (savedEventList[i].eventTicketMasterUrL == null) {
      savedTicketmasterUrl = ''
    } else {
      savedTicketmasterUrl = savedEventList[i].eventTicketMasterUrL
    }

    let finalUrl = ''
    if (savedPromoterUrl === '' && savedTicketmasterUrl === '') {
      finalUrl = ''
    } else if (savedPromoterUrl !== '' && savedTicketmasterUrl === '') {
      finalUrl = savedPromoterUrl
    } else if (savedPromoterUrl === '' && savedTicketmasterUrl !== '') {
      finalUrl = savedTicketmasterUrl
    } else if (savedPromoterUrl !== '' && savedTicketmasterUrl !== '') {
      finalUrl = savedPromoterUrl
    }

    const eventList = $('<a>')
    eventList.addClass('collection-item')
    eventList.attr('href', finalUrl)
    eventList.attr('id', 'opacity')
    eventList.attr('target', '_blank')
    eventList.text(`${savedEventList[i].eventName} - Date: ${savedEventList[i].eventDate}`)

    $('#event-list-brief').append(eventList)
    
  }

}


renderLists()
initMap()





$('#searchbar-container2').on('submit', function(event) {
  event.preventDefault()
 
  const saveSearch = searchValue.val() 
  const regexNumber = /^[0-9]+$/;
  // A blank space is intended after a-zA-Z to include space between city names
  const regexString = /^[a-zA-Z ]+$/;    
  if (saveSearch.match(regexString) && saveSearch !== 'Please enter a valid city or zip') {
      localStorage.setItem('savedSearchBrewery', saveSearch)
      localStorage.setItem('savedSearchEvent', saveSearch)
      localStorage.setItem('savedSearchZip', '')
  } else if (saveSearch.match(regexNumber)) {
      localStorage.setItem('savedSearchZip', saveSearch)
      localStorage.setItem('savedSearchBrewery', '')
      localStorage.setItem('savedSearchEvent', '')
  } else {
      searchValue.val('Please enter a valid city or zip')
  }

  window.location = 'defaultResults.html'

} )

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
