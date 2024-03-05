
let lat;
let lon;

const googleGeocoding = `https://maps.googleapis.com/maps/api/geocode/json?address=irvine%20ca%20usa&key=AIzaSyD1gsa4zv5uIoI49Jw0HZOn2kVv0feSbHg`
fetch(googleGeocoding).then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log(data)
    lat = data.results[0].geometry.location.lat
    lon = data.results[0].geometry.location.lng
    console.log(lat, lon)
})


const openBreweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&by_type=micro&per_page=1000`

fetch(openBreweryUrl).then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log(data)
})


// const openBreweryUrl = 'https://api.openbrewerydb.org/v1/breweries?by_city=san_diego&per_page=50'

// fetch(openBreweryUrl).then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data)
// })
