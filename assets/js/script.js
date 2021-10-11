var formCodesEl = document.querySelector("#searchCodes");
var formFlightsEl = document.querySelector("#searchFlights");
var formExchangeEl = document.querySelector("#rateExchange");

var originCurrency = "";
var destinationCurrency = "";

var searchHistoryArr = [];
var flightsIndex = 0;
var flightObj = {
  originAirport: "",
  destinationAirport: "",
  originCountry: "",
  destinationCountry: "",
  originCity: "",
  destinationCity: "",
  flightDate: ""
};

var exchangeRate = ""; //destinationCurrencyRate divided by originCurrencyRate
var currencyValue = 1; //1 is default value

var restoreSearchHistory = function (savedFlights) {
  for (var i = 0; i < savedFlights.length; i++) {
    flightObj.originAirport = JSON.parse(savedFlights[i]).originAirport;
    flightObj.destinationAirport = JSON.parse(savedFlights[i]).destinationAirport;
    flightObj.originCountry = JSON.parse(savedFlights[i]).originCountry;
    flightObj.destinationCountry = JSON.parse(savedFlights[i]).destinationCountry;
    flightObj.flightDate = JSON.parse(savedFlights[i]).flightDate;
    // console.log(flightObj);
    addToHistory();
  }
}

var displayCodes = function (response) {
  var codesDivEl = document.getElementById("display-codes-container");
  codesDivEl.innerHTML = '';
  var codescontainerEl = document.createElement("div");
  codescontainerEl.className = "col s12 light-blue accent-4";
  var codesHeader = document.createElement('h3');
  codesHeader.textContent = 'Results for "' + document.querySelector("#city-to-translate").value + '"';
  codesHeader.className = "col s12 white-text light-blue darken-4";
  codescontainerEl.appendChild(codesHeader);
  for (var i = 0; i < response.Places.length; i++) {
    // console.log(response.Places[i]);
    var codeArr = response.Places[i].PlaceId.split("-");
    //console.log(codeArr);
    var airportCodes = document.createElement("p");
    airportCodes.textContent = codeArr[0] + ": " + response.Places[i].PlaceName;
    airportCodes.className = "col s6 white-text";
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

var displayEmptyFlights = function () {
//   console.log("I'm in the displayEmptyFlights function");
  var displayFlightsContainerEl = document.getElementById("display-flights-container");
  displayFlightsContainerEl.innerHTML = "";
  var displayRateContEl = document.querySelector("#rate-exchange-display-container");
  displayRateContEl.innerHTML = "";
  var flightsCardEl = document.createElement('div');
  flightsCardEl.className = "col s12 light-blue accent-4";
  var flightHeaderEl = document.createElement('h3');
  var flightContentEl = document.createElement('p');
  // console.log(response.Quotes[i].OutboundLeg.OriginId);
  // console.log(response.Places);
  flightHeaderEl.textContent = "Uh-oh! That Search Yielded No Results!"
  // console.log(flightHeaderEl.textContent);
  flightHeaderEl.className = "col s12 white-text light-blue darken-4";
  flightHeaderEl.id = "no-flight-header";
  flightsCardEl.appendChild(flightHeaderEl);
  flightContentEl.textContent = "Try Another Search Instead";
  flightContentEl.className = "col s12 white-text";
  flightsCardEl.appendChild(flightContentEl);
  displayFlightsContainerEl.appendChild(flightsCardEl);
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
    var flightDateEl = document.createElement('h3');
    var flightCostEl = document.createElement('p');
    // console.log(response.Quotes[i].OutboundLeg.OriginId);
    // console.log(response.Places);
    flightHeaderEl.textContent = translatePlaceId(response.Quotes[i].OutboundLeg.OriginId, response.Places) + " to " + translatePlaceId(response.Quotes[i].OutboundLeg.DestinationId, response.Places)
    // console.log(flightHeaderEl.textContent);
    flightHeaderEl.className = "col s10 white-text light-blue darken-4";
    flightHeaderEl.id = "flight-header";
    flightsCardEl.appendChild(flightHeaderEl);
    flightObj.flightDate = moment(Date.parse(response.Quotes[i].OutboundLeg.DepartureDate)).format("YYYY-MM-DD");
    flightDateEl.textContent = moment(Date.parse(response.Quotes[i].OutboundLeg.DepartureDate)).format('l');
    // console.log("The unformatted date is " + flightDateEl.textContent);
    // console.log("The formatted date is " + );
    // console.log("The formatted date is " + moment(Date.parse(flightDateEl.textContent)).format("MM/DD/YYYY")); //Parse into
    flightDateEl.className = "col s2 white-text light-blue darken-4";
    flightDateEl.id = "flight-card-date";
    flightsCardEl.appendChild(flightDateEl);
    flightAirlineEl.textContent = "Airline: " + translateCarrierId(response.Quotes[i].OutboundLeg.CarrierIds[0], response.Carriers);
    flightAirlineEl.className = "col s12 white-text";
    flightsCardEl.appendChild(flightAirlineEl);
    flightCostEl.textContent = "Price: $" + response.Quotes[i].MinPrice;
    flightCostEl.className = "col s12 white-text";
    flightsCardEl.appendChild(flightCostEl);
    displayFlightsContainerEl.appendChild(flightsCardEl);
    // console.log("displayFlights Info: " + JSON.stringify(searchHistoryArr));
    // console.log("displayFlights Info: " + JSON.stringify(flightObj));
  }
}

var getCurrencies = function () {
  fetch("https://restcountries.com/v3.1/name/" + flightObj.originCountry)
    .then(response => {
      return response.json();
    })
    .then(response => {
      // console.log(response);
      if (flightObj.originCity === "Hong Kong") {
        originCurrency = "HKD";
      } else if (flightObj.originCity === "Macau") {
        originCurrency = "MOP";
      } else if (flightObj.originCountry === "China") {
        originCurrency = "CNY";
      } else {
        var currencyObj = response[0].currencies;
        originCurrency = Object.keys(currencyObj)[0]; //INCLUDE ADDITIONAL LOGIC FOR CHINA WHICH AS MULTIPLE CURRENCIES
      }
    //   console.log('The origin currency is ' + originCurrency);
      return fetch("https://restcountries.com/v3.1/name/" + flightObj.destinationCountry)
    })
    .then(response => {
      return response.json();
    })
    .then(response => {
      // console.log(response);
      if (flightObj.destinationCity === "Hong Kong") {
        destinationCurrency = "HKD";
      } else if (flightObj.destinationCity === "Macau") {
        destinationCurrency = "MOP";
      } else if (flightObj.destinationCountry === "China") {
        destinationCurrency = "CNY";
      } else {
        var currencyObj = response[0].currencies;
        destinationCurrency = Object.keys(currencyObj)[0]; //INCLUDE ADDITIONAL LOGIC FOR CHINA WHICH AS MULTIPLE CURRENCIES
      }
    //   console.log('The destination currency is ' + destinationCurrency);
      getExchangeRate(originCurrency, destinationCurrency, true);
    //   console.log(flightObj);
    })
}

var getCountries = function (response) {
  for (var i = 0; i < response.Places.length; i++) {
    // console.log(response.Places[i].SkyscannerCode);
    // console.log(flightObj.originAirport);
    // console.log(flightObj.destinationCountry);
    if (response.Places[i].SkyscannerCode == flightObj.originAirport) {
      flightObj.originCountry = response.Places[i].CountryName;
      flightObj.originCity = response.Places[i].CityName;
    } else if (response.Places[i].SkyscannerCode == flightObj.destinationAirport) {
      flightObj.destinationCountry = response.Places[i].CountryName;
      flightObj.destinationCity = response.Places[i].CityName;
    }
  }
//   console.log('The origin country is ' + flightObj.originCountry);
//   console.log('The destination country is ' + flightObj.destinationCountry);
  getCurrencies();
}

var apiCalls = function (addHistory) {
  fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + flightObj.originAirport + "-sky/" + flightObj.destinationAirport + "-sky/" + flightObj.flightDate, {
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
    //   console.log(response);
    //   console.log(response.Quotes);
      if (response.Quotes.length === 0) {
        displayEmptyFlights();
      } else {
        displayFlights(response);
        getCountries(response);
        // flightObj.originCountry = response.Places[0].CountryName;
        // flightObj.destinationCountry = response.Places[1].CountryName;
        // console.log(flightObj.originCountry);
        // console.log(flightObj.destinationCountry);
        // console.log("apiCalls Info: " + JSON.stringify(searchHistoryArr));
        // console.log("apiCalls Info: " + JSON.stringify(flightObj));
        if (addHistory) {
          addToHistory();
        }
      }
    })
}

var getFlights = function (event) {
  event.preventDefault();
  flightObj.originAirport = document.querySelector("#origin-city").value;
  flightObj.originAirport = flightObj.originAirport.toUpperCase();
  flightObj.destinationAirport = document.querySelector("#destination-city").value;
  flightObj.destinationAirport = flightObj.destinationAirport.toUpperCase();
  flightObj.flightDate = document.querySelector("#dates").value;
  // var passNumInput = document.querySelector("#num-passengers").value;
  // console.log("getFlights Info: " + JSON.stringify(searchHistoryArr));
  // console.log("getFlights Info: " + JSON.stringify(flightObj));
  apiCalls(true);

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

var displayExchangeRate = function (originCurrency, destinationCurrency, exchangeRate, flightSearch) {
//   console.log(flightObj);
  var displayRateContEl = document.querySelector("#rate-exchange-display-container");
  displayRateContEl.innerHTML = "";
  var ratesCardEl = document.createElement('div');
  ratesCardEl.className = "col s12 light-blue accent-4";
  var rateHeader = document.createElement('h3');
  var rateContent = document.createElement('p');
  if (flightSearch) {
    if (flightObj.originCountry === flightObj.destinationCountry && flightObj.originCountry === "China" && (flightObj.originCity === "Hong Kong" || flightObj.destinationCity === "Hong Kong" || flightObj.originCity === "Macau" || flightObj.destinationCity === "Macau")) {
      rateHeader.textContent = "This flight will travel from " + flightObj.originCity + " to " + flightObj.destinationCity;
    } else if (flightObj.originCountry === flightObj.destinationCountry && (flightObj.originCity != "Hong Kong" || flightObj.destinationCity != "Hong Kong" || flightObj.originCity != "Macau" || flightObj.destinationCity != "Macau")) {
      rateHeader.textContent = "This flight will travel domestically in " + flightObj.originCountry;
    } else if (flightObj.originCountry != flightObj.destinationCountry && (flightObj.originCity === "Hong Kong" || flightObj.destinationCity === "Hong Kong" || flightObj.originCity === "Macau" || flightObj.destinationCity === "Macau")) {
      if ((flightObj.originCity === "Hong Kong" || flightObj.originCity === "Macau") && (flightObj.destinationCity === "Hong Kong" || flightObj.destinationCity === "Macau")) {
        rateHeader.textContent = "This flight will travel from " + flightObj.originCity + " to " + flightObj.destinationCity;
      } else if ((flightObj.originCity === "Hong Kong" || flightObj.originCity === "Macau") && (flightObj.destinationCity != "Hong Kong" || flightObj.destinationCity != "Macau")) {
        rateHeader.textContent = "This flight will travel from " + flightObj.originCity + " to " + flightObj.destinationCountry;
      } else if ((flightObj.originCity != "Hong Kong" || flightObj.originCity != "Macau") && (flightObj.destinationCity === "Hong Kong" || flightObj.destinationCity === "Macau")) {
        rateHeader.textContent = "This flight will travel from " + flightObj.originCountry + " to " + flightObj.destinationCity;
      }
    } else {
      rateHeader.textContent = "This flight will travel from " + flightObj.originCountry + " to " + flightObj.destinationCountry;
    }
  } else {
    rateHeader.textContent = "According to the Current Exchange Rate";
  }
  console.log(originCurrency);
  console.log(destinationCurrency);
  if (originCurrency === destinationCurrency){
    rateContent.textContent = "No currency exchange required!"
  } else {
    rateContent.textContent = (Number(currencyValue)).toFixed(2) + " " + originCurrency + " = " + ((Number(currencyValue)) * (Number(exchangeRate))).toFixed(2) + " " + destinationCurrency;
  }
  rateHeader.className = "col s12 white-text light-blue darken-4";
  ratesCardEl.appendChild(rateHeader);
  rateContent.className = "col s12 white-text";
  ratesCardEl.appendChild(rateContent);
  displayRateContEl.appendChild(ratesCardEl);
}

var getExchangeRate = function (originCurrency, destinationCurrency, flightSearch) {
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
      exchangeRate = destinationCurrencyRate / originCurrencyRate;
      // console.log(originCurrencyRate);
      // console.log(destinationCurrencyRate);
      // console.log(exchangeRate);
      displayExchangeRate(originCurrency, destinationCurrency, exchangeRate, flightSearch);
    });
}

var startExchange = function (event) {
  event.preventDefault();
  startCurrency = document.querySelector("#startMoney").value;
  endCurrency = document.querySelector("#endMoney").value;
  if (document.querySelector("#oamount").value > 1) {
    currencyValue = document.querySelector("#oamount").value
  }
  // console.log(startCurrency);
  // console.log(endCurrency);
  getExchangeRate(startCurrency, endCurrency, false); //false means this was not from a flight search
}

var clearHistory = function () {
  searchHistoryArr = [];
  var searchHistoryEl = document.getElementById('search-history');
  searchHistoryEl.innerHTML = "";
  var searchHistoryButtonEl = document.getElementById('search-history-button');
  searchHistoryButtonEl.innerHTML = "";
  localStorage.setItem("flightsHistory", JSON.stringify(searchHistoryArr));
}

var addToHistory = function () {
  // console.log(flightObj);
  var inHistory = false;
  // console.log(searchHistoryArr);
  for (var i = 0; i < searchHistoryArr.length; i++) {
    // console.log(JSON.stringify(flightObj));
    // console.log(searchHistoryArr[i]);
    if (JSON.stringify(flightObj) === searchHistoryArr[i]) {
      inHistory = true;
    }
  }

  // console.log('is it in the history?: ' + inHistory);
  if (inHistory === false) {
    // console.log("updating history")
    var copyFlightObj = JSON.stringify(flightObj);
    searchHistoryArr.push(copyFlightObj);
    var searchHistoryEl = document.getElementById('search-history');
    var flightButtonEl = document.createElement('button');
    flightButtonEl.id = 'flightHistoryButton' + flightsIndex;
    flightButtonEl.textContent = flightObj.originAirport + " to " + flightObj.destinationAirport + " - " + moment(flightObj.flightDate).format('l');
    flightButtonEl.className = "waves-effect waves-light btn-small light-blue accent-4 col";
    searchHistoryEl.appendChild(flightButtonEl);

    var flightHistoryButtonEl = document.querySelector('#flightHistoryButton' + flightsIndex);
    flightHistoryButtonEl.addEventListener("click", redisplayFlights)

    flightsIndex++;
  }

  localStorage.setItem("flightsHistory", JSON.stringify(searchHistoryArr));

  searchHistoryButtonEl = document.getElementById('search-history-button');
  searchHistoryButtonEl.innerHTML = "";
  var savedFlights = localStorage.getItem("flightsHistory");
  if (savedFlights && savedFlights != [] && searchHistoryArr.innerHTML === undefined) {
    // console.log("empty search history array: " + searchHistoryArr.innerHTML);
    var clearHistoryButtonEl = document.createElement('button');
    clearHistoryButtonEl.className = "waves-effect waves-light btn-large light-blue accent-4"
    clearHistoryButtonEl.id = "clear-history-button";
    clearHistoryButtonEl.textContent = "Clear History";
    searchHistoryButtonEl.appendChild(clearHistoryButtonEl);

    searchHistoryButtonEl.addEventListener("click", clearHistory)
  }


}

var redisplayFlights = function (event) {
  event.preventDefault();
  var targetEl = event.target;
//   console.log(targetEl);
//   console.log("I'm in the redisplayFlights function");
  var targetId = String(targetEl.id);
//   console.log(targetId.substring(19));
  var savedFlightIndex = targetId.substring(19);
//   console.log(searchHistoryArr[savedFlightIndex]);
  flightObj.originAirport = JSON.parse(searchHistoryArr[savedFlightIndex]).originAirport;
  flightObj.destinationAirport = JSON.parse(searchHistoryArr[savedFlightIndex]).destinationAirport;
  flightObj.originCountry = JSON.parse(searchHistoryArr[savedFlightIndex]).originCountry;
  flightObj.destinationCountry = JSON.parse(searchHistoryArr[savedFlightIndex]).destinationCountry;
  flightObj.flightDate = JSON.parse(searchHistoryArr[savedFlightIndex]).flightDate;
  apiCalls(false);
}

formCodesEl.addEventListener("submit", getCodes);
formFlightsEl.addEventListener("submit", getFlights);
formExchangeEl.addEventListener("submit", startExchange);

var savedFlights = localStorage.getItem("flightsHistory");
// console.log(savedFlights);
if (savedFlights) {
  savedFlightsParsed = JSON.parse(savedFlights);
  // console.log("what are the saved flights? " + savedFlights);
  // searchHistoryArr = savedFlights;
  // console.log(savedFlightsParsed);
  restoreSearchHistory(savedFlightsParsed);
}

// console.log(flightsIndex);

// localStorage.setItem("flightsHistory", []);
