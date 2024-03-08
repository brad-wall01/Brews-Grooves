const approveAge = $('#approve')
const declineAge = $('#decline')
const backgroundBody = $('body')
const searchValue = $('#searchbar')

function redirectToResultPage() {
    window.location= "./assets/html/defaultResults.html"
}

$(document).ready(function(){
$('.modal').modal();
});

function generateManateeJoke() {
    openApiUrl = 'https://manateejokesapi.herokuapp.com/manatees/random'
    fetch(openApiUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(typeof data.setup);
        $('#manatee-joke').html(convertStringToOneWord(data.setup))
        $('#manatee-joke-punchline').html(convertStringToOneWord(data.punchline))
    })
}

function convertStringToOneWord(string) {
    const newString = string.replaceAll(' ', `&nbsp;`)
    console.log(newString);
    return newString
}

generateManateeJoke()

approveAge.on('click', function(){
    $('#age-verify-container').empty()
    $('#searchbar').attr('style', 'visibility: visible')
    $('#searchbtn').attr('style', 'visibility: visible')
})

declineAge.on('click', function(){
    $('.container').empty()
    $('footer').remove()
    $('.container').addClass('center-align')
    const memeContainer = $('<div>')
    memeContainer.addClass('memeContainer')
    const memeImage = $('<img>')
    memeImage.attr('src', './assets/images/underagememe.jpg')
    $('.container').append(memeContainer)
    memeContainer.append(memeImage)
    document.body.style.backgroundImage = "url(./assets/images/underage.jpg)"
})

$('#searchbar-container').on('submit', function(event) {
    event.preventDefault()

    const saveSearch = searchValue.val() 
    const regexNumber = /^[0-9]+$/;
    // A blank space is intended after a-zA-Z to include space between city names
    const regexString = /^[a-zA-Z ]+$/;    
    if (saveSearch.match(regexString) && saveSearch !== 'Please enter a valid city or zip') {
        localStorage.setItem('savedSearchBrewery', saveSearch)
        localStorage.setItem('savedSearchEvent', saveSearch)
        localStorage.setItem('savedSearchZip', '')
        redirectToResultPage()
    } else if (saveSearch.match(regexNumber)) {
        localStorage.setItem('savedSearchZip', saveSearch)
        localStorage.setItem('savedSearchBrewery', '')
        localStorage.setItem('savedSearchEvent', '')
        redirectToResultPage()
    } else {
        searchValue.val('Please enter a valid city or zip')
    }
    
} )

$(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
  });

$('.jokes').on('click', '#manatee-joke', function(){
    $('#manatee-joke-punchline').attr('style', 'visibility: visible')
})

$('#close-joke').on('click', '#close-joke-anchor', function(){
    if ($('#manatee-joke').attr('style')==='visibility: hidden') {
        $('#manatee-joke').attr('style', 'visibility: visible')
        $('#manatee-joke-punchline').attr('style', 'visibility: visible')    
    } else {
    $('#manatee-joke').attr('style', 'visibility: hidden')
    $('#manatee-joke-punchline').attr('style', 'visibility: hidden')
    }
})

$(document).ready(function(){
    $('.tooltipped').tooltip();
  });



// const musicEventUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=san+diego&sort=date,asc&apikey=IscikhVGdREr7vEQ81GjQtz6aABUHOfK'

// fetch(musicEventUrl).then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data)
// })

// const city = 'san+diego' 

// $.ajax({
//     type:"GET",
//     url:`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${city}&sort=date,asc&apikey=IscikhVGdREr7vEQ81GjQtz6aABUHOfK`,
//     async:true,
//     dataType: "json",
//     success: function(json) {
//                 console.log(json);
                
//                 // Parse the response.
//                 // Do other things.
//              },
//     error: function(xhr, status, err) {
//                 // This time, we do not end up here!
//              }
//   });


