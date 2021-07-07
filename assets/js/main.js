var cityEl =  document.querySelector(".city-input");
var searchEl = document.querySelector(".search");
var mainCityEl = document.querySelector(".main-city");
var searchFunctionEl = document.querySelector(".search-function");


var APIKey = "5328e04cbea129ba9d5674e8f71d661f";
var startQueryURL = "https://api.openweathermap.org/data/2.5/onecall?appid=" + APIKey + "&units=metric&exclude=alerts,minutely";


var queryMapURL = "https://nominatim.openstreetmap.org/search.php?city=melbourne&format=jsonv2"

function getMapApi() {
    fetch(queryMapURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data);


            for (let i = 0; i < 3; i++) {
                var mapCityResult = document.createElement('button');
                mapCityResult.textContent = data[i].display_name;
                searchFunctionEl.appendChild(mapCityResult);

                mapCityResult.addEventListener("click", function(){
           
                    var lon = data[i].lon;
                    var lat = data[i].lat;

                    constructURL(lat, lon);


                }, false);
            }
        })
}

function getWeatherApi(queryURL) {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
}


function constructURL(lat, lon) {
    var queryURL = startQueryURL + "&lat=" + lat + "&lon=" + lon;
    getWeatherApi(queryURL);
}



searchEl.addEventListener("click", function() {
    getMapApi();
});


