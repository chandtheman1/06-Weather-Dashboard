var APIKey = "5328e04cbea129ba9d5674e8f71d661f";
var city = "austin";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric" + "&exclude=hourly,daily";

// var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=5328e04cbea129ba9d5674e8f71d661f";
function getApi() {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
}