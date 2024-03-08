// Initialize and add the map
let map;

// Grab the Lat/Lon for the city searched to center it on the map.
const searchedCityLat = Number(localStorage.getItem('searchedCityLatitude'))
const searchedCityLon = Number(localStorage.getItem('searchedCityLongitude'))

// function that renders the map
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
    const contentString = 
      '<div id="content">' +
      `<h6 id="breweryName">${markersBrewery[i][0]} </h6>` +
      `<p>${markersBrewery[i][4]}</p>` +
      `<p>${markersBrewery[i][3]}</p>` +
      `<a href="${markersBrewery[i][5]} target="_blank">${markersBrewery[i][5]}</a>` +
      `</div>`
    const infowindow = new InfoWindow({
      content: contentString,
      ariaLabel: markersBrewery[i][0]
    })
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

    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map,
      })
    })

    map.addListener('click', () => {
      infowindow.close()
    })
  }
  
  // load Event markers
  let savedMarkersEvents = loadFromSavedListEvents()
  let markersEvents = savedMarkersEvents

  for (let i = 0; i < markersEvents.length; i++) {
    let position = new google.maps.LatLng(markersEvents[i][1], markersEvents[i][2])
    const label = `${[i+1]}`
    const contentString = 
      '<div id="content">' +
      `<h6 id="eventName">${markersEvents[i][0]} </h6>` +
      `<p>${markersEvents[i][3]}</p>` +
      `<p>Venue: ${markersEvents[i][4]}</p>` +
      `<a href="${markersEvents[i][5]} target="_blank">Promoter's Website</a><br>` +
      `<a href="${markersEvents[i][6]} target="_blank">Ticketmaster's Website</a>` +
      `</div>`
    const infowindow = new InfoWindow({
      content: contentString,
      ariaLabel: markersEvents[i][0]
    })
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

    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map,
      })
    })

    map.addListener('click', () => {
      infowindow.close()
    })
  }


}

function loadFromSavedListBrewery() {
  const savedBreweryList = JSON.parse(localStorage.getItem('searchedBreweryList'))
  let markerList = []
  for (let i = 0; i < savedBreweryList.length; i++) {
    let markerListToAdd = [savedBreweryList[i].breweryName, Number(savedBreweryList[i].breweryLatitude), Number(savedBreweryList[i].breweryLongitude),
                      reformatPhone(savedBreweryList[i].breweryPhone), savedBreweryList[i].breweryAddress, savedBreweryList[i].breweryWebsite]
    markerList.push(markerListToAdd)

    
  }
  console.log(markerList);
  return markerList
}

function loadFromSavedListEvents() {
  const savedEventList = JSON.parse(localStorage.getItem('searchedEventList'))
  let markerList = []
  for (let i = 0; i < savedEventList.length; i++) {
    let markerListToAdd = [savedEventList[i].eventName, Number(savedEventList[i].eventLat), Number(savedEventList[i].eventLon), savedEventList[i].eventAddress,
                      savedEventList[i].eventLocationName, savedEventList[i].eventPromotorUrl, savedEventList[i].eventTicketMasterUrL]
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
      console.log(numVal)
      num = numVal.slice(0,3)+"-" + numVal.slice(3,6)+ "-" +numVal.slice(6)
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
      savedBreweryPhone = reformatPhone(savedBreweryList[i].breweryPhone)
    }


    const breweryList = $('<a>')
    breweryList.addClass('collection-item')
    breweryList.attr('href', savedBreweryUrl)
    breweryList.attr('id', 'opacity')
    breweryList.attr('target', '_blank')
    breweryList.text(`${[i+1]}. ${savedBreweryList[i].breweryName} - Phone: ${savedBreweryPhone}`)

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
    eventList.text(`${[i+1]}. ${savedEventList[i].eventName} - Date: ${savedEventList[i].eventDate}`)

    $('#event-list-brief').append(eventList)
    
  }

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
