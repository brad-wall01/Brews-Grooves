const selectSpecificBrewery = $('#brewery-search-list')
const selectSpecificEvent = $('#event-search-list')


// this function is not needed/used for now as we're searching by distance using latitude / longitude
function getSearchParameterBrewery() {
    let savedSearch = localStorage.getItem('savedSearchBrewery')
    savedSearch = savedSearch.replace(' ', '_')
    console.log(savedSearch)
    return savedSearch
}


function getSearchParameterEvent() {
    let savedSearch = localStorage.getItem('savedSearchBrewery')
    savedSearch = savedSearch.replace(' ', '+')
    console.log(savedSearch)
    return savedSearch
}

function getSearchParameterGoogle() {
    let savedSearch = localStorage.getItem('savedSearchBrewery')
    savedSearch = savedSearch.replace(' ', '%20')
    console.log(savedSearch)
    return savedSearch
}

function getSearchParameterGoogleZip() {
    let savedSearch = localStorage.getItem('savedSearchZip')
    return savedSearch
}

function determineCityOrZip() {
    const cityBrewery = localStorage.getItem('savedSearchBrewery')
    const cityZip = localStorage.getItem('savedSearchZip')
    if (cityBrewery == '') {
        console.log('cityBrewery is null');
        const searchResult = getSearchParameterGoogleZip()
        console.log(searchResult);
        return searchResult
    } else if (cityZip == '') {
        console.log('cityZip is null')
        const searchResult = getSearchParameterGoogle()
        return searchResult
    }
}

function getGeocodeData() {

    const searchCity = determineCityOrZip()
    console.log(searchCity);

    const googleGeocoding = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchCity}&key=AIzaSyD1gsa4zv5uIoI49Jw0HZOn2kVv0feSbHg`
    console.log(googleGeocoding);
    fetch(googleGeocoding).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        lat = data.results[0].geometry.location.lat
        lon = data.results[0].geometry.location.lng
        localStorage.setItem('searchedCityLatitude', lat)
        localStorage.setItem('searchedCityLongitude', lon)
        getBreweryData()
    })

}

// function to reformat the string for phone number into more readable format.
function reformatPhone(num) {
    
    if (num === null) {
        // do nothing
    } else {
        let numVal = num.replace(/\D[^\.]/g, "")
        num = numVal.slice(0,3)+"-"+numVal.slice(3,6)+"-"+numVal.slice(6)
        return num
    }
}

function loadBreweryList() {
    const savedBreweryList = JSON.parse(localStorage.getItem(`searchedBreweryList`))
    return savedBreweryList
}

function saveBreweryList(list) {
    breweryData.push(list)
    
}

function loadEventList() {
    const savedEventList = JSON.parse(localStorage.getItem(`searchedEventList`))
    return savedEventList
}

function saveEventList(list) {
    eventData.push(list)
    
}
// Global Variable to save to localStorage
let breweryData = [];
let eventData = [];

function getBreweryData() {

    const lat = localStorage.getItem('searchedCityLatitude')
    const lon = localStorage.getItem('searchedCityLongitude')
    console.log(lat, lon);
    const openBreweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${lat},${lon}&per_page=10`
    console.log(openBreweryUrl);

    fetch(openBreweryUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        localStorage.setItem(`searchedBreweryList`, ``)
        for (let i = 0; i < data.length; i++) {
            
            let addBreweryListData = {
                breweryId: crypto.randomUUID(),
                breweryName: data[i].name,
                breweryAddress: data[i].address_1,
                breweryCity: data[i].city,
                breweryPhone: data[i].phone,
                breweryWebsite: data[i].website_url,
                breweryLatitude: data[i].latitude,
                breweryLongitude: data[i].longitude
            }

            const li = $('<li>')
            
            const headerDiv = $('<div>')
            headerDiv.addClass('collapsible-header')
            
            headerDiv.html(`<i class="material-icons">place</i>${data[i].name}`)
            
            const linkToSite = $('<div>')
            linkToSite.attr('id','link-to-site')
            linkToSite.html(`<i class="material-icons">near_me</i>`)
            // linkToSite.children('i').attr('id','redirect-btn')
            linkToSite.children('i').addClass('redirect-btn')
            linkToSite.children('i').attr('id', `${addBreweryListData.breweryId}`)

            const bodyDiv = $('<div>')
            bodyDiv.addClass('collapsible-body')

            const breweryAddress = $('<p>')
            breweryAddress.attr('id','brewery-info')
            breweryAddress.text(`${data[i].address_1}, ${data[i].city}`)
            
            const breweryPhone = $('<p>')
            breweryPhone.attr('id', 'brewery-info')
            // let breweryPhoneReformat = reformatPhone(data[i].phone)
            breweryPhone.text(reformatPhone(data[i].phone))

            const breweryWebsite = $('<p>')
            breweryWebsite.attr('id','brewery-info')
            breweryWebsite.text(data[i].website_url)

            const removeItem = data[i].brewery_type
            
            $('#brewery-search-list').append(li)
            li.append(headerDiv)
            headerDiv.append(linkToSite)
            li.append(bodyDiv)
            bodyDiv.append(breweryAddress)
            bodyDiv.append(breweryPhone)
            bodyDiv.append(breweryWebsite)

            if (removeItem==='closed' || removeItem==='planning') {
               li.attr('id', 'remove')
            } else {
                saveBreweryList(addBreweryListData)
            }

        }

        $('#brewery-search-list').children('#remove').remove()

        localStorage.setItem('searchedBreweryList', JSON.stringify(breweryData))

    })
}

function getEventData() {
    let musicEventUrl;

    const cityEvent = localStorage.getItem('savedSearchEvent')
    const cityZip = localStorage.getItem('savedSearchZip')
    if (cityEvent == '') {
        console.log('cityEvent is null');
        const searchResult = getSearchParameterGoogleZip()
        console.log(searchResult);
        musicEventUrl = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&postalCode=${searchResult}&sort=date,asc&apikey=IscikhVGdREr7vEQ81GjQtz6aABUHOfK`
        console.log(musicEventUrl);
    } else if (cityZip == '') {
        console.log('cityZip is null')
        const searchResult = getSearchParameterEvent().toLowerCase()
        musicEventUrl = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${searchResult}&sort=date,asc&apikey=IscikhVGdREr7vEQ81GjQtz6aABUHOfK`
        console.log(musicEventUrl);
    }

    fetch(musicEventUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        // console.log(data._embedded.events[0].name);
        // console.log(data._embedded.events[0].dates.start.localDate);
        // console.log(data._embedded.events[0].url); //promoter website page
        // console.log(data._embedded.events[0]._embedded.venues[0].address);
        // console.log(data._embedded.events[0]._embedded.venues[0].city);
        // console.log(data._embedded.events[0]._embedded.venues[0].name);
        // console.log(data._embedded.events[0]._embedded.venues[0].url);
        // console.log(data._embedded.events[0]._embedded.venues[0].location.latitude);
        // console.log(data._embedded.events[0]._embedded.venues[0].location.longitude);
        localStorage.setItem('searchedEventList', '')
        console.log(data._embedded);
        if (data._embedded != null) {
            for (let i = 0; i < data._embedded.events.length; i++) {

                let addEventListData = {
                    eventId: crypto.randomUUID(),
                    eventName: data._embedded.events[i].name,
                    eventDate: data._embedded.events[i].dates.start.localDate,
                    eventAddress: data._embedded.events[i]._embedded.venues[0].address.line1,
                    eventCity: data._embedded.events[i]._embedded.venues[0].city.name,
                    eventLocationName: data._embedded.events[i]._embedded.venues[0].name,
                    eventTicketMasterUrL: data._embedded.events[i]._embedded.venues[0].url,
                    eventPromotorUrl: data._embedded.events[i].url,
                    eventLat: data._embedded.events[i]._embedded.venues[0].location.latitude,
                    eventLon: data._embedded.events[i]._embedded.venues[0].location.longitude
                }

                const li = $('<li>')
                    
                const headerDiv = $('<div>')
                headerDiv.addClass('collapsible-header')
                
                headerDiv.html(`<i class="material-icons">event</i>${addEventListData.eventName}, (${addEventListData.eventDate})`)
                
                const linkToSite = $('<div>')
                linkToSite.attr('id','link-to-site')
                linkToSite.html(`<i class="material-icons">near_me</i>`)
                // linkToSite.children('i').attr('id','redirect-btn')
                linkToSite.children('i').addClass('redirect-btn')
                linkToSite.children('i').attr('id', `${addEventListData.eventId}`)

                const bodyDiv = $('<div>')
                bodyDiv.addClass('collapsible-body')

                const eventAddress = $('<p>')
                eventAddress.attr('id','event-info')
                eventAddress.text(`${addEventListData.eventAddress}, ${addEventListData.eventCity}`)
                
                const eventVenueName = $('<p>')
                eventVenueName.attr('id', 'event-info')
                // let eventVenueNameReformat = reformatPhone(data[i].phone)
                eventVenueName.text(`Venue: ${addEventListData.eventLocationName}`)

                const eventWebsite = $('<p>')
                eventWebsite.attr('id','event-info')
                eventWebsite.html(`<a href="${addEventListData.eventPromotorUrl}" target="_blank" style="color:white; text-decoration: underline">Promotor's Website</a>`)

                const eventTicketmasterWebsite = $('<p>')
                eventTicketmasterWebsite.attr('id', 'event-info')
                eventTicketmasterWebsite.html(`<a href="${addEventListData.eventTicketMasterUrL}" target="_blank" style="color:white; text-decoration: underline">Ticketmaster Website</a>`)

                
                $('#event-search-list').append(li)
                li.append(headerDiv)
                headerDiv.append(linkToSite)
                li.append(bodyDiv)
                bodyDiv.append(eventAddress)
                bodyDiv.append(eventVenueName)
                bodyDiv.append(eventWebsite)
                bodyDiv.append(eventTicketmasterWebsite)

                saveEventList(addEventListData)

            }
            localStorage.setItem('searchedEventList', JSON.stringify(eventData))
        }

    })


}


// 

function mouseClickValue(event) {
    const mousePointer = event.target.id
    console.log(mousePointer);
    localStorage.setItem('targetBreweryToLoad', mousePointer)
    window.location = 'beerMain.html'
}

function mouseClickValueForEvent(event) {
    const mousePointer = event.target.id
    console.log(mousePointer);
    localStorage.setItem('targetEventToLoad', mousePointer)
    window.location = 'musicMain.html'
}


// initial page load runs below function which also runs the brewery/event search API calls.
getEventData()
getGeocodeData()

// Javascript / Jquery for event listeners and Materialize functions

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {
        accordion: false
    });
});

$('#searchbar-container2').on('submit', function(event) {
    console.log('hello');
    event.preventDefault()

    breweryData= [];
    $('#brewery-search-list').empty()
    $('#event-search-list').empty()

    const saveSearch = searchValue.val() 
    const regexNumber = /^[0-9]+$/;
    // A blank space is intended after a-zA-Z to include space between city names
    const regexString = /^[a-zA-Z ]+$/;    
    if (saveSearch.match(regexString) && saveSearch !== 'Please enter a valid city or zip') {
        localStorage.setItem('savedSearchBrewery', saveSearch)
        localStorage.setItem('savedSearchEvent', saveSearch)
        localStorage.setItem('savedSearchZip', '')
        
        getGeocodeData()
        getEventData()
    } else if (saveSearch.match(regexNumber)) {
        localStorage.setItem('savedSearchZip', saveSearch)
        localStorage.setItem('savedSearchBrewery', '')
        localStorage.setItem('savedSearchEvent', '')
        getGeocodeData()
        getEventData()
    } else {
        searchValue.val('Please enter a valid city or zip')
    }

} )

document.addEventListener('DOMContentLoaded', function() {
    var sidenavfunction = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavfunction);
  });

selectSpecificBrewery.on('click', '.redirect-btn' , mouseClickValue)

selectSpecificEvent.on('click', '.redirect-btn' , mouseClickValueForEvent)

