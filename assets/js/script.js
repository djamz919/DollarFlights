var formCodesEl = document.querySelector("#searchCodes");
var formFlightsEl = document.querySelector("#searchFlights");

var displayCodes = function (response) {
  var codescontainerEl = document.getElementById("display-codes-container");
  for (var i =0; i < response.Places.length; i++) {
    console.log(response.Places[i]);
    var codeArr = response.Places[i].PlaceId.split("-");
    //console.log(codeArr);
    var airportCodes = document.createElement("p");
    airportCodes.textContent = codeArr[0] + ": " + response.Places[i].PlaceName;
    codescontainerEl.appendChild(airportCodes);
  }
}

var getCodes = function (event) {
  event.preventDefault();
  var cityInput = document.querySelector("#city-to-translate").value;
  console.log(cityInput);
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
      console.log(response);
      displayCodes(response);
    });

}

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

  fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/BKK-sky/JFK-sky/2021-10-15?inboundpartialdate=2021-10-30", {
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
      console.log(response);
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

formCodesEl.addEventListener("submit", getCodes);
formFlightsEl.addEventListener("submit", getFlights);