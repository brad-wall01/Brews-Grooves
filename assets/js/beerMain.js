// const cardContainer = $('#card-container')

function reformatPhone(num) {
    
    if (num === null) {
        // do nothing
    } else {
        let numVal = num.replace(/\D[^\.]/g, "")
        num = numVal.slice(0,3)+"-"+numVal.slice(3,6)+"-"+numVal.slice(6)
        return num
    }
}

function renderPage() {
    const breweryTargetId = localStorage.getItem('targetBreweryToLoad')
    const breweryListFromLocal = JSON.parse(localStorage.getItem('searchedBreweryList'))
    let bName;
    let bAddress;
    let bPhone;
    let bWebsite;
    for (let i = 0; i < breweryListFromLocal.length; i++) {
        if (breweryTargetId === breweryListFromLocal[i].breweryId){
            if (breweryListFromLocal[i].breweryAddress === null) {
                bAddress = `${breweryListFromLocal[i].breweryCity}`
                localStorage.setItem('breweryLastClickedAddress',bAddress)
            } else {
                bAddress = `${breweryListFromLocal[i].breweryAddress}, ${breweryListFromLocal[i].breweryCity}`
                localStorage.setItem('breweryLastClickedAddress', bAddress)
            }
            bName = breweryListFromLocal[i].breweryName
            bPhone = reformatPhone(breweryListFromLocal[i].breweryPhone)
            bWebsite = breweryListFromLocal[i].breweryWebsite
            localStorage.setItem('breweryLastClickedName', bName)
            localStorage.setItem('breweryLastClickedPhone', bPhone)
            localStorage.setItem('breweryLastClickedWebsite', bWebsite)
        } else {
            bAddress = localStorage.getItem('breweryLastClickedAddress')
            bName = localStorage.getItem('breweryLastClickedName')
            bPhone = localStorage.getItem('breweryLastClickedPhone')
            bWebsite = localStorage.getItem('breweryLastClickedWebsite')
        }

        $(`#selected-brewery-name`).text(bName)
        $(`#selected-brewery-address`).text(bAddress)
        $(`#selected-brewery-phone`).text(bPhone)
        $(`#selected-brewery-website`).text(bWebsite)
        $(`#selected-brewery-website-link`).attr('href', bWebsite)
        $(`#selected-brewery-website-link`).attr('target', "_blank")
    }
    
}

function newEventSearch() {
    const breweryLocationData = JSON.parse(localStorage.getItem('searchedBreweryList'))
    const breweryTargetId = localStorage.getItem('targetBreweryToLoad')
    let city;
    for (let i = 0; i < breweryLocationData.length; i++) {
        if (breweryTargetId === breweryLocationData[i].breweryId) {
            city = breweryLocationData[i].breweryCity
            console.log(`i found you. The city is ${city}`);
            localStorage.setItem('cityOfBreweryLastClicked', city)
        } else {
            city = localStorage.getItem('cityOfBreweryLastClicked')
        }
    }

    const replacedCityName = city.replace(' ','+').toLowerCase()

    let musicEventUrl;
    musicEventUrl = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${replacedCityName}&sort=date,asc&apikey=IscikhVGdREr7vEQ81GjQtz6aABUHOfK`;

    console.log(musicEventUrl);

    fetch(musicEventUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        for (let i = 0; i < 5; i++) {

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

            console.log(addEventListData);
            $(`#event-card-title${[i]}`).text(`${addEventListData.eventName} - ${addEventListData.eventDate}`)
            $(`#event-card-address${[i]}`).text(`${addEventListData.eventAddress}, ${addEventListData.eventCity}`)
            $(`#event-card-venue${[i]}`).text(`Venue: ${addEventListData.eventLocationName}`)
            $(`#event-card-promoter-link${[i]}`).attr('href', addEventListData.eventPromotorUrl)
            $(`#event-card-promoter-link${[i]}`).text(`Link to Promoter Website`)
            $(`#event-card-ticketmaster-link${[i]}`).attr('href', addEventListData.eventTicketMasterUrL)
            $(`#event-card-ticketmaster-link${[i]}`).text('Link to Ticketmaster')



        }
    })

}


renderPage()
newEventSearch()


$('#searchbar-container2').on('submit', function(event) {
    console.log('hello');
    event.preventDefault()

    window.location = 'defaultResults.html'
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

$('.searchbar-side').on('submit', function(event) {
    event.preventDefault()

    const searchValue2 = $('#searchbar2')
    
    breweryData= [];
    $('#brewery-search-list').empty()
    $('#event-search-list').empty()

    const saveSearch = searchValue2.val() 
    const regexNumber = /^[0-9]+$/;
    // A blank space is intended after a-zA-Z to include space between city names
    const regexString = /^[a-zA-Z ]+$/;    
    if (saveSearch.match(regexString) && saveSearch !== 'Please enter a valid city or zip') {
        localStorage.setItem('savedSearchBrewery', saveSearch)
        localStorage.setItem('savedSearchEvent', saveSearch)
        localStorage.setItem('savedSearchZip', '')
        
        window.location = 'defaultResults.html'
    } else if (saveSearch.match(regexNumber)) {
        localStorage.setItem('savedSearchZip', saveSearch)
        localStorage.setItem('savedSearchBrewery', '')
        localStorage.setItem('savedSearchEvent', '')
    } else {
        searchValue2.val('Please enter a valid city or zip')
    }

} )


document.addEventListener('DOMContentLoaded', function() {
    var sidenavfunction = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavfunction);
  });

$('#back-to-default-result-page').on('click', function() {
    console.log('hello');
    window.location = 'defaultResults.html'
})

// document.addEventListener('DOMContentLoaded', function() {
//     const elems = document.querySelectorAll('.carousel');
//     M.Carousel.init(elems)
//     M.Carousel.fullWidth(true)
//     });

$(document).ready(function () { 
    $('.carousel').carousel(
        {
            numVisible: 3,
        }
    ); 
}); 

