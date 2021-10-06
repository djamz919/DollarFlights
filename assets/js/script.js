var formCodesEl = document.querySelector("#searchCodes");
var formFlightsEl = document.querySelector("#searchFlights");
var formExchangeEl = document.querySelector("#rateExchange");
var originAirport = "";
var destinationAirport = "";
var originCountry = "";
var destinationCountry = "";
var originCurrency = "";
var destinationCurrency = "";
var exchangeRate = ""; //destinationCurrencyRate divided by originCurrencyRate
var currencyValue = 1; //1 is default value

var displayCodes = function (response) {
  var codesDivEl = document.getElementById("display-codes-container");
  codesDivEl.innerHTML = '';
  var codescontainerEl = document.createElement("div");
  codescontainerEl.className = "col s12 light-blue accent-4";
  var codesHeader = document.createElement('h3');
  codesHeader.textContent = 'Results for "' + document.querySelector("#city-to-translate").value + '"';
  codescontainerEl.appendChild(codesHeader);
  for (var i = 0; i < response.Places.length; i++) {
    // console.log(response.Places[i]);
    var codeArr = response.Places[i].PlaceId.split("-");
    //console.log(codeArr);
    var airportCodes = document.createElement("p");
    airportCodes.textContent = codeArr[0] + ": " + response.Places[i].PlaceName;
    codescontainerEl.appendChild(airportCodes);
  }
  codesDivEl.appendChild(codescontainerEl);
}

var getCodes = function (event) {
  event.preventDefault();
  var cityInput = document.querySelector("#city-to-translate").value;
  // console.log(cityInput);
  fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + cityInput, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "22e4217b56msha848310ddf5ef00p15961cjsn99320da72316"
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.error(err);
    })
    .then(response => {
      // console.log(response);
      displayCodes(response);
    });
}

var translatePlaceId = function (id, places) {
  var airportName = "";
  for (var i = 0; i < places.length; i++) {
    // console.log(places[i].PlaceId);
    // console.log(id);
    if (id === places[i].PlaceId) {
      airportName = places[i].Name;
      // console.log(airportName);
      return airportName;
    }
  }
}

var translateCarrierId = function (id, carrierIds) {
  var airlineName = "";
  for (var i = 0; i < carrierIds.length; i++) {
    // console.log(places[i].PlaceId);
    // console.log(id);
    if (id === carrierIds[i].CarrierId) {
      airlineName = carrierIds[i].Name;
      // console.log(airlineName);
      return airlineName;
    }
  }
}

var displayFlights = function (response) {
  // Origin Airport to Destination Airport; Airline and Flight ID; Time of Departure; Cost
  var displayFlightsContainerEl = document.getElementById("display-flights-container");
  displayFlightsContainerEl.innerHTML = "";
  // console.log(response.Quotes.length);
  for (var i = 0; i < response.Quotes.length; i++) {
    var flightsCardEl = document.createElement('div');
    flightsCardEl.className = "col s12 light-blue accent-4";
    flightsCardEl.id = "flights" + i;
    var flightHeaderEl = document.createElement('h3');
    var flightAirlineEl = document.createElement('p');
    // var flightDateEl = document.createElement('p');
    var flightCostEl = document.createElement('p');
    // console.log(response.Quotes[i].OutboundLeg.OriginId);
    // console.log(response.Places);
    flightHeaderEl.textContent = translatePlaceId(response.Quotes[i].OutboundLeg.OriginId, response.Places) + " to " + translatePlaceId(response.Quotes[i].OutboundLeg.DestinationId, response.Places)
    // console.log(flightHeaderEl.textContent);
    flightHeaderEl.className = "col s12";
    flightsCardEl.appendChild(flightHeaderEl);
    // flightDateEl.textContent = response.Quotes[i].OutboundLeg.DepartureDate;
    // flightDateEl.className = "col s4";
    // flightsCardEl.appendChild(flightDateEl);
    flightAirlineEl.textContent = "Airline: " + translateCarrierId(response.Quotes[i].OutboundLeg.CarrierIds[0], response.Carriers);
    flightAirlineEl.className = "col s12";
    flightsCardEl.appendChild(flightAirlineEl);
    flightCostEl.textContent = "Price: $" + response.Quotes[i].MinPrice;
    flightCostEl.className = "col s12";
    flightsCardEl.appendChild(flightCostEl);
    displayFlightsContainerEl.appendChild(flightsCardEl);
  }
}

var getCurrencies = function (originCountry, destinationCountry) {
  fetch("https://restcountries.com/v3.1/name/" + originCountry)
    .then(response => {
      return response.json();
    })
    .then(response => {
      // console.log(response);
      var currencyObj = response[0].currencies;
      originCurrency = Object.keys(currencyObj)[0]; //INCLUDE ADDITIONAL LOGIC FOR CHINA WHICH AS MULTIPLE CURRENCIES
      console.log('The origin currency is ' + originCurrency);
      return fetch("https://restcountries.com/v3.1/name/" + destinationCountry)
    })
    .then(response => {
      return response.json();
    })
    .then(response => {
      // console.log(response);
      var currencyObj = response[0].currencies; //INCLUDE ADDITIONAL LOGIC FOR CHINA WHICH AS MULTIPLE CURRENCIES
      destinationCurrency = Object.keys(currencyObj)[0];
      console.log('The destination currency is ' + destinationCurrency);
      getExchangeRate(originCurrency, destinationCurrency);
    })
}

var getCountries = function (response) {
  for (var i = 0; i < response.Places.length; i++) {
    // console.log(response.Places[i].SkyscannerCode);
    // console.log(originAirport);
    // console.log(destinationCountry);
    if (response.Places[i].SkyscannerCode == originAirport) {
      originCountry = response.Places[i].CountryName;
    } else if (response.Places[i].SkyscannerCode == destinationAirport) {
      destinationCountry = response.Places[i].CountryName;
    }
  }
  console.log('The origin country is ' + originCountry);
  console.log('The destination country is ' + destinationCountry);
  getCurrencies(originCountry, destinationCountry);
}

var getFlights = function (event) {
  event.preventDefault();
  originAirport = document.querySelector("#origin-city").value;
  originAirport = originAirport.toUpperCase();
  destinationAirport = document.querySelector("#destination-city").value;
  destinationAirport = destinationAirport.toUpperCase();
  var dateInput = document.querySelector("#dates").value;
  // var passNumInput = document.querySelector("#num-passengers").value;
  // console.log(startCityInput);
  // console.log(endCityInput);
  // console.log(dateInput);
  // console.log(passNumInput);
  fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + originAirport + "-sky/" + destinationAirport + "-sky/" + dateInput, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "22e4217b56msha848310ddf5ef00p15961cjsn99320da72316"
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.error(err);
    })
    .then(response => { //PENDING LOGIC IF NO FLIGHTS ARE AVAILABLE
      console.log(response);
      displayFlights(response);
      getCountries(response);
      // originCountry = response.Places[0].CountryName;
      // destinationCountry = response.Places[1].CountryName;
      // console.log(originCountry);
      // console.log(destinationCountry);
    });

  // fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/SFO/JFK/2021-10-10?inboundpartialdate=2021-10-25", {
  //   "method": "GET",
  //   "headers": {
  //     "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
  //     "x-rapidapi-key": "dfc29d63b5msh5885edecbba1a13p1f59b8jsn9bc3d9c5df85"
  //   }
  // })
  //   .then(response => {
  //     console.log(response);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
}

var displayExchangeRate = function (originCurrency, destinationCurrency, exchangeRate){
  displayRateContEl = document.querySelector("#rate-exchange-display-container");
  displayRateContEl.innerHTML = "";
  var ratesCardEl = document.createElement('div');
  ratesCardEl.className = "col s12 light-blue accent-4";
  var rateContent = document.createElement('h3');
  rateContent.textContent = currencyValue + " " + originCurrency + " = " + (currencyValue*exchangeRate).toFixed(2) + " " + destinationCurrency;
  ratesCardEl.appendChild(rateContent);
  displayRateContEl.appendChild(ratesCardEl);
}

var getExchangeRate = function (originCurrency, destinationCurrency) {
  fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json')
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.error(err);
    })
    .then(response => {
      // console.log(response);
      startCurrency = originCurrency.toLowerCase();
      endCurrency = destinationCurrency.toLowerCase();
      // console.log(startCurrency);
      // console.log(endCurrency);
      // console.log(response.eur);
      // console.log(response.eur.usd);
      var eurObj = response.eur;
      // console.log(eurObj);
      // console.log(eurObj[startCurrency]);
      var originCurrencyRate = eurObj[startCurrency];
      var destinationCurrencyRate = eurObj[endCurrency];
      exchangeRate = destinationCurrencyRate/originCurrencyRate;
      // console.log(originCurrencyRate);
      // console.log(destinationCurrencyRate);
      // console.log(exchangeRate);
      displayExchangeRate(originCurrency, destinationCurrency, exchangeRate);
    });
  }

  var startExchange = function (event) {
    event.preventDefault();
    startCurrency = document.querySelector("#startMoney").value;
    endCurrency = document.querySelector("#endMoney").value;
    if(document.querySelector("#oamount").value > 1){
      currencyValue = document.querySelector("#oamount").value
    }
    // console.log(startCurrency);
    // console.log(endCurrency);
    getExchangeRate(startCurrency, endCurrency);
  }

// var getExchangeRate = function (event) {
//   event.preventDefault();
//   var rateInput = document.querySelector("#oamount").value;
//   // console.log(rateInput);
//   fetch("https://fixer-fixer-currency-v1.p.rapidapi.com/convert?from=USD&to=ILS&amount=12", {
//     "method": "GET",
//     "headers": {
//       "x-rapidapi-host": "fixer-fixer-currency-v1.p.rapidapi.com",
//       "x-rapidapi-key": "957447a831mshed8a5216f1c641fp19235djsnb370d1085dc7"
//     }
//   })
//     .then(response => {
//       console.log(response);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// }

formCodesEl.addEventListener("submit", getCodes);
formFlightsEl.addEventListener("submit", getFlights);
formExchangeEl.addEventListener("submit",startExchange);
