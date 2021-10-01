var formEl = document.querySelector("#searchFlights");

var getFlights = function (event) {
    event.preventDefault();
    var startCityInput = document.querySelector("#origin-city").value;
    var endCityInput = document.querySelector("#destination-city").value;
    var dateInput = document.querySelector("#dates").value;
    var passNumInput = document.querySelector("#num-passengers").value;
    console.log(startCityInput);
    console.log(endCityInput);
    console.log(dateInput);
    console.log(passNumInput);
}

formEl.addEventListener("submit", getFlights);

var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: 'eelLngUiI8tMLybF8tU866k2elgx1TMC',
  clientSecret: 'tnQE2DyNGwHltXmo'
});

amadeus.shopping.flightOffersSearch.get({
    originLocationCode: 'SYD',
    destinationLocationCode: 'BKK',
    departureDate: '2021-08-01',
    adults: '2'
}).then(function(response){
  console.log(response.data);
}).catch(function(responseError){
  console.log(responseError.code);
});