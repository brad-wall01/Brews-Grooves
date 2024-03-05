
let lat;
let lon;

async function getGeocodeData() {
   

    const googleGeocoding = `https://maps.googleapis.com/maps/api/geocode/json?address=irvine%20ca%20usa&key=AIzaSyD1gsa4zv5uIoI49Jw0HZOn2kVv0feSbHg`
    fetch(googleGeocoding).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        lat = data.results[0].geometry.location.lat
        lon = data.results[0].geometry.location.lng
        console.log(lat)
        console.log(lon);
    })

}

async function getBreweryData(lat,lon) {
    console.log(lat);
    const openBreweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${lat},${lon}&per_page=3`
    console.log(openBreweryUrl);

    fetch(openBreweryUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
    })
}


getGeocodeData()
getBreweryData()
// const openBreweryUrl = 'https://api.openbrewerydb.org/v1/breweries?by_city=san_diego&per_page=50'

// fetch(openBreweryUrl).then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data)
// })
