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