var APIKey;
var city = "austin";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric" + "&exclude=hourly,daily";


function getApi() {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
}