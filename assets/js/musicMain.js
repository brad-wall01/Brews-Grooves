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
    const eventTargetId = localStorage.getItem('targetEventToLoad')
    const eventListFromLocal = JSON.parse(localStorage.getItem('searchedEventList'))
    let eName;
    let eDate;
    let eAddress;
    let eVenue;
    let ePromoterUrl;
    let eTicketMasterUrl;
    let eLat;
    let eLon;

    // This for loop will find the matching id that is unique to each event and render the event card on the left of the viewport.
    for (let i = 0; i < eventListFromLocal.length; i++) {
        if (eventTargetId === eventListFromLocal[i].eventId){
            // In case address is missing, we're only going to show the city with below IF statement
            if (eventListFromLocal[i].eventAddress === null) {
                eAddress = `${eventListFromLocal[i].eventCity}`
                localStorage.setItem('eventLastClickedAddress',eAddress)
            } else {
                eAddress = `${eventListFromLocal[i].eventAddress}, ${eventListFromLocal[i].eventCity}`
                localStorage.setItem('eventLastClickedAddress', eAddress)
            }

            // In case promoter url is null, we're going to remove text for link to not render it on the card
            if (eventListFromLocal[i].eventPromotorUrl === null) {
                $('#selected-event-promoter-url').text('')
            } else {
                ePromoterUrl = eventListFromLocal[i].eventPromotorUrl
            }
            
             // In case ticketmaster url is null, we're going to remove text for link to not render it on the card
            //  Doing a soft compare with two equal signs since undefined is softly matching null.
            if (eventListFromLocal[i].eventTicketMasterUrl == null) {
                $('#selected-event-ticketmaster-url').text('')
            } else {
                eTicketMasterUrl = eventListFromLocal[i].eventTicketMasterUrl
            }

            // Setting values from each object in array of saved event list to render onto the page
            eName = eventListFromLocal[i].eventName
            eDate = eventListFromLocal[i].eventDate
            eVenue = eventListFromLocal[i].eventLocationName
            eLat = eventListFromLocal[i].eventLat
            eLon = eventListFromLocal[i].eventLon

            // These below save to localStorage is in case the user hits 'back' button on the browser instead of searching and clicking to get to the page to properly load/render the cards

            localStorage.setItem('eventLastClickedName', eName)
            localStorage.setItem('eventLastClickedDate', eDate)
            localStorage.setItem('eventLastClickedAddress', eAddress)
            localStorage.setItem('eventLastClickedVenue', eVenue)
            localStorage.setItem('eventLastClickedPromotorUrl', ePromoterUrl)
            localStorage.setItem('eventLastClickedTicketMasterUrl', eTicketMasterUrl)
            localStorage.setItem('eventLastClickedLatitude', eLat)
            localStorage.setItem('eventLastClickedLongitude', eLon)
        } else {
            eName = localStorage.getItem('eventLastClickedName')
            eDate = localStorage.getItem('eventLastClickedDate')
            eAddress = localStorage.getItem('eventLastClickedAddress')
            eVenue =  localStorage.getItem('eventLastClickedVenue')
            ePromoterUrl = localStorage.getItem('eventLastClickedPromotorUrl')
            eTicketMasterUrl = localStorage.getItem('eventLastClickedTicketMasterUrl')
            eLat = localStorage.getItem('eventLastClickedLatitude')
            eLon = localStorage.getItem('eventLastClickedLongitude')
        }

        // After for loop runs and finds the corresponding event, render the information to the event card.
        $(`#selected-event-name`).text(`${eName} - ${eDate}`)
        $(`#selected-event-address`).text(eAddress)
        $(`#selected-event-venue`).text(eVenue)
        $(`#selected-event-promoter-url`).attr('href', ePromoterUrl)
        $(`#selected-event-ticketmaster-url`).attr('href', eTicketMasterUrl)
        $(`#selected-event-website-link`).attr('target', "_blank")
    }
    
}

function newBrewerySearch() {
    const eventLocationData = JSON.parse(localStorage.getItem('searchedEventList'))
    const eventTargetId = localStorage.getItem('targetEventToLoad')
    let lat;
    let lon;
    let openBreweryUrl;
    for (let i = 0; i < eventLocationData.length; i++) {
        if (eventTargetId === eventLocationData[i].eventId) {
            lat = eventLocationData[i].eventLat
            lon = eventLocationData[i].eventLon
            openBreweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${lat},${lon}&per_page=10`;
            console.log(`i found you. The lat / lon is ${lat}, ${lon}`);
            localStorage.setItem('latOfEventLastClicked', lat)
            localStorage.setItem('lonOfEventLastClicked', lon)
            localStorage.setItem('openBreweryAPIOfEventLastClicked', openBreweryUrl)
        } else {
            lat = localStorage.getItem('latOfeventLastClicked')
            lon = localStorage.getItem('lonOfeventLastClicked')
            openBreweryUrl = localStorage.getItem('openBreweryAPIOfEventLastClicked')
        }
    }

    console.log(openBreweryUrl);

    fetch(openBreweryUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {

            let addEventListData = {
                bName: data[i].name,
                bAddress: data[i].address_1,
                bCity: data[i].city,
                bPhone: data[i].phone,
                bWebsite: data[i].website_url
            }

            const breweryCard = $('<div>')
            breweryCard.addClass('col s12 m8')
            breweryCard.attr('id', 'brewery-card')

            const breweryName = $('<h4>')
            breweryName.addClass('header')
            breweryName.text(addEventListData.bName)

            const breweryCardContainer = $('<div>')
            breweryCardContainer.addClass('card horizontal')
            
            const breweryCardStacked = $('<div>')
            breweryCardStacked.addClass('card-stacked')

            const breweryCardContent = $('<div>')
            breweryCardContent.addClass('card-content')

            const breweryCardAddress = $('<p>')
            breweryCardAddress.attr('id', 'brewery-address')
            breweryCardAddress.text(`${addEventListData.bAddress}, ${addEventListData.bCity}`)
            
            const breweryCardPhone = $('<p>')
            breweryCardPhone.attr('id', 'brewery-phone')
            breweryCardPhone.text(addEventListData.bPhone)
            
            const breweryCardWebsite = $('<p>')
            breweryCardWebsite.attr('id', 'brewery-website')
            breweryCardWebsite.text(addEventListData.bWebsite)

            const breweryCardAction = $('<div>')
            breweryCardAction.addClass('card-action')

            const breweryCardLink = $('<a>')
            breweryCardLink.attr(`href`, addEventListData.bWebsite)
            breweryCardLink.attr('target', '_blank')
            breweryCardLink.text('Link to website')

            $('#brewery-list-holder').append(breweryCard)
            breweryCard.append(breweryName)
            breweryCard.append(breweryCardContainer)
            breweryCardContainer.append(breweryCardStacked)
            breweryCardStacked.append(breweryCardContent)
            breweryCardContent.append(breweryCardAddress)
            breweryCardContent.append(breweryCardPhone)
            breweryCardContent.append(breweryCardWebsite)
            breweryCardStacked.append(breweryCardAction)
            breweryCardAction.append(breweryCardLink)

        }
    })

}


renderPage()
newBrewerySearch()


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

$('#back-to-default-result-page').on('click', function() {
    console.log('hello');
    window.location = 'defaultResults.html'
})

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.carousel');
     M.Carousel.init(elems);
  });


