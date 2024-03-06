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
        console.log(data)
        console.log(data[1].name);
        console.log(data[1].address_1);
        console.log(typeof data[1].phone);
        console.log(data[1].website_url);
        console.log(data[1].city);
        for (let i = 0; i < data.length; i++) {
            const li = $('<li>')

            const headerDiv = $('<div>')
            headerDiv.addClass('collapsible-header')
            
            headerDiv.html(`<i class="material-icons">place</i>${data[i].name}`)
            
            const linkToSite = $('<div>')
            linkToSite.attr('id','link-to-site')
            linkToSite.html(`<i class="material-icons">near_me</i>`)

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
            }
        }

        $('#brewery-search-list').children('#remove').remove()
    })
}

// 

// initial page load runs below function which also runs the brewery/event search API calls.
getGeocodeData()

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {
        accordion: false
    });
});

$('#searchbar-container2').on('submit', function(event) {
    console.log('hello');
    event.preventDefault()

    $('#brewery-search-list').empty()
    // $('#event-search-list').empty()

    const saveSearch = searchValue.val() 
    const regexNumber = /^[0-9]+$/;
    // A blank space is intended after a-zA-Z to include space between city names
    const regexString = /^[a-zA-Z ]+$/;    
    if (saveSearch.match(regexString) && saveSearch !== 'Please enter a valid city or zip') {
        localStorage.setItem('savedSearchBrewery', saveSearch)
        localStorage.setItem('savedSearchEvent', saveSearch)
        localStorage.setItem('savedSearchZip', '')
        getGeocodeData()
    } else if (saveSearch.match(regexNumber)) {
        localStorage.setItem('savedSearchZip', saveSearch)
        localStorage.setItem('savedSearchBrewery', '')
        localStorage.setItem('savedSearchEvent', '')
        getGeocodeData()
    } else {
        searchValue.val('Please enter a valid city or zip')
    }

} )

document.addEventListener('DOMContentLoaded', function() {
    var sidenavfunction = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavfunction);
  });


