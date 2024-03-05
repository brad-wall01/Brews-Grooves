const approveAge = $('#approve')
const declineAge = $('#decline')
const backgroundBody = $('body')



$(document).ready(function(){
$('.modal').modal();
});


approveAge.on('click', function(){
    $('#age-verify-container').empty()
    $('#searchbar').attr('style', 'visibility: visible')
})

declineAge.on('click', function(){
    $('.container').empty()
    $('.container').addClass('center-align')
    const memeContainer = $('<div>')
    memeContainer.addClass('memeContainer')
    const memeImage = $('<img>')
    memeImage.attr('src', './assets/images/underagememe.jpg')
    $('.container').append(memeContainer)
    memeContainer.append(memeImage)
    document.body.style.backgroundImage = "url(./assets/images/underage.jpg)"
})