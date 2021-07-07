var cityEl =  document.querySelector(".city-input");
var searchEl = document.querySelector(".search");
var mainCityEl = document.querySelector(".main-city");
var searchFunctionEl = document.querySelector(".search-function");
var forecastEl = document.querySelector(".forecast");
var multipleCityEl = document.querySelector(".multiple-city");



var APIKey = "5328e04cbea129ba9d5674e8f71d661f";
var startQueryURL = "https://api.openweathermap.org/data/2.5/onecall?appid=" + APIKey + "&units=metric&exclude=alerts,minutely,hourly";




function getMapApi(queryMapURL) {
    fetch(queryMapURL)
        .then(function (response) {
            return response.json();
            // console.log(response);
        })
        .then(function (data) {

            //checks if the location inputted is valid
            if (data.length == 0) {
                alert("Location not found");
            } else {
                
                for (let i = 0; i < 3; i++) {
                    var mapCityResult = document.createElement('button');
                    mapCityResult.textContent = data[i].display_name;
                    mapCityResult.classList.add("mapButton");
                    searchFunctionEl.appendChild(mapCityResult);

                    mapCityResult.addEventListener("click", function(){
           
                        var lon = data[i].lon;
                        var lat = data[i].lat;

                        constructURL(lat, lon);

                }, false);
            }            
        }
        })
    
        
}

function getWeatherApi(queryURL) {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            createMainCity(data);
            forecastCity(data);
        })
}


function constructURL(lat, lon) {
    var queryURL = startQueryURL + "&lat=" + lat + "&lon=" + lon;
    getWeatherApi(queryURL);
}

var mapURL = "https://nominatim.openstreetmap.org/search.php?city="

searchEl.addEventListener("click", function() {
    
    removeElements();

            
    var city = cityEl.value.trim();
    var queryMapURL = mapURL + city + "&format=jsonv2";
    cityEl.value = "";
    
    getMapApi(queryMapURL);
    

});

function removeElements() {
    mapButtonEl = document.querySelectorAll(".mapButton");
    mapButtonEl.forEach(element => {
        element.parentNode.removeChild(element);
    });

}


function createMainCity(data) { 
    console.log(data);
    var divEl = document.createElement("div")
    var h3El = document.createElement("h3");
    var p1El = document.createElement("p");
    var p2El = document.createElement("p");
    var p3El = document.createElement("p");
    var p4El = document.createElement("p");
    var spanEl = document.createElement("span");
    var imgEl = document.createElement("img");

    divEl.classList.add("city");

    p1El.textContent = "Temp: " + data.current.temp + "°C";
    p2El.textContent = "Wind: " + data.current.wind_speed + "km/h";
    p3El.textContent = "Humidity: " + data.current.humidity + "%";
    p4El.textContent = "UV Index: ";
    spanEl.textContent = data.daily[0].uvi;

    imgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + "@2x.png");

    if (data.daily[0].uvi <= 2) {
        spanEl.classList.add("uv-low");
    } else if (data.daily[0].uvi <= 5) {
        spanEl.classList.add("uv-medium");
    } else if (data.daily[0].uvi <= 7) {
        spanEl.classList.add("uv-high");
    } else if (data.daily[0].uvi <= 10) {
        spanEl.classList.add("uv-very-high");
    } else {
        spanEl.classList.add("uv-extremely-high");
    }

    spanEl.classList.add("uv-low");

    mainCityEl.append(divEl);
    divEl.append(h3El);
    divEl.append(imgEl);
    divEl.append(p1El);
    divEl.append(p2El);
    divEl.append(p3El);
    divEl.append(p4El);
    p4El.append(spanEl);

}


function forecastCity(data) {
    for (var i = 1; i < 6; i++) {
        var sectionEl = document.createElement("section")
        var h4El = document.createElement("h4");
        var p1El = document.createElement("p");
        var p2El = document.createElement("p");
        var p3El = document.createElement("p");
        var imgEl = document.createElement("img");

        sectionEl.classList.add("card");

        h4El.textContent = moment().add(i, 'day').format('L');
        imgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        p1El.textContent = "Temp: " + data.daily[i].temp.max + "°C";
        p2El.textContent = "Wind: " + data.daily[i].wind_speed + "km/h";
        p3El.textContent = "Humidity: " + data.daily[i].humidity + "%";

        forecastEl.append(sectionEl);
        sectionEl.append(h4El);
        sectionEl.append(imgEl);
        sectionEl.append(p1El);
        sectionEl.append(p2El);
        sectionEl.append(p3El);
    }
}