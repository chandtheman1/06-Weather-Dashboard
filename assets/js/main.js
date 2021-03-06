var cityInputEl =  document.querySelector(".city-input");
var searchEl = document.querySelector(".search");
var mainCityEl = document.querySelector(".main-city");
var searchFunctionEl = document.querySelector(".search-function");
var forecastEl = document.querySelector(".forecast");
var multipleCityEl = document.querySelector(".multiple-city");
var cityEl = document.querySelector(".city");
var historyEl = document.querySelector(".history");


//API key
var APIKey = "5328e04cbea129ba9d5674e8f71d661f";
//API open weather URL
var startQueryURL = "https://api.openweathermap.org/data/2.5/onecall?appid=" + APIKey + "&units=metric&exclude=alerts,minutely,hourly";
//API nominatim URL
var mapURL = "https://nominatim.openstreetmap.org/search.php?city="

//local storage
if (JSON.parse(localStorage.getItem("city")) == null) {
    var savedCity = [];
} else {
    var savedCity = JSON.parse(localStorage.getItem("city"));
}

//API call that resolves names of cities to latitudes and longtitudes
function getMapApi(queryMapURL) {
    fetch(queryMapURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {


            //checks if the location inputted is valid
            if (data.length == 0) {
                alert("Location not found");
            } else {
            //creates more selections that finds similar city names but in different countries
                for (let i = 0; i < 3; i++) {
                    
                    
                    var mapCityResult = document.createElement('button');
                    var nameString = data[i].display_name.split(",");
                    mapCityResult.textContent = nameString[0] + ", " + nameString[nameString.length - 1];
                    mapCityResult.classList.add("mapButton", "color-search");
                    searchFunctionEl.appendChild(mapCityResult);

                    mapCityResult.addEventListener("click", function(){

                        removeElements();
                        var lon = data[i].lon;
                        var lat = data[i].lat;

                        constructURL(lat, lon);

                        
                        savedCity.push(data[i]); 
                        saveStorage(data[i]);
                        
                        var buttonEl = document.createElement("button");

                        buttonEl.textContent = nameString[0] + ", " + nameString[nameString.length - 1];
                        historyEl.append(buttonEl);
                
                        buttonEl.addEventListener("click", function () {
                            constructURL(lat, lon);
                            removeElements();
                        } )

                }, false);
            }     
     
        }
        })
}

//open weather API call
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

//adds the lat and lon into open weather URL
function constructURL(lat, lon) {
    var queryURL = startQueryURL + "&lat=" + lat + "&lon=" + lon;
    getWeatherApi(queryURL);
}



//function that calls open weather
searchEl.addEventListener("click", function() {
    
    removeElements();

    var city = cityInputEl.value.trim();
    var queryMapURL = mapURL + city + "&format=jsonv2";
    cityInputEl.value = "";
    
    getMapApi(queryMapURL);
    
    
});


//removes the main card and forecast card

function removeElements() {
    mapButtonEl = document.querySelectorAll(".mapButton");
    mapButtonEl.forEach(element => {
        element.parentNode.removeChild(element);
    });

    clearEl = document.querySelectorAll(".clear");
    clearEl.forEach(element => {
        element.parentNode.removeChild(element);
    })


}

//creates the main card and extracts the API call data

function createMainCity(data) { 

    var lat = data.lat;
    var lon = data.lon;


    //this function helps resolves the names of the city, by reversing resolving from lat and lon to city name
    function reverseMapApi (lat, lon) {
        fetch("https://nominatim.openstreetmap.org/reverse.php?lat=" + lat + "&lon=" + lon + "&format=jsonv2")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var cityName = data.address.city.trim();
                var h3El = document.createElement("h3");
                h3El.textContent = cityName;
                cityEl.append(h3El);
                h3El.classList.add("clear");

            }
            )
    }

    var nameEl = reverseMapApi(lat, lon);
    
    
    var p1El = document.createElement("p");
    var p2El = document.createElement("p");
    var p3El = document.createElement("p");
    var p4El = document.createElement("p");
    var spanEl = document.createElement("span");
    var imgEl = document.createElement("img");

    var elementArray = [imgEl, p1El, p2El, p3El, p4El];

    p1El.textContent = "Temp: " + data.current.temp + "??C";
    p2El.textContent = "Wind: " + data.current.wind_speed + "km/h";
    p3El.textContent = "Humidity: " + data.current.humidity + "%";
    p4El.textContent = "UV Index: ";
    spanEl.textContent = data.daily[0].uvi;
    //displays the image
    imgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + "@2x.png");

    // UV function that shows background colors depending on severity

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



    elementArray.forEach(element => cityEl.append(element));
    p4El.append(spanEl);

    elementArray.forEach(element => element.classList.add("clear"));

}

//function that displays the forecast data as a loop
function forecastCity(data) {
    for (var i = 1; i < 6; i++) {
        var sectionEl = document.createElement("section")
        var h4El = document.createElement("h4");
        var p1El = document.createElement("p");
        var p2El = document.createElement("p");
        var p3El = document.createElement("p");
        var imgEl = document.createElement("img");

        var elementArray = [h4El, p1El, p2El, p3El, imgEl];

        sectionEl.classList.add("card", "clear");

        h4El.textContent = moment().add(i, 'day').format('L');
        imgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        p1El.textContent = "Temp: " + data.daily[i].temp.max + "??C";
        p2El.textContent = "Wind: " + data.daily[i].wind_speed + "km/h";
        p3El.textContent = "Humidity: " + data.daily[i].humidity + "%";

        forecastEl.append(sectionEl);

        elementArray.forEach(element => sectionEl.append(element));
        elementArray.forEach(element => element.classList.add("clear"));
    }
}



function saveStorage() {
    localStorage.setItem("city", JSON.stringify(savedCity));
}

//function that retrieves from local storage and displays as history buttons
function retrieveStorage() {


    var retrievedCity = JSON.parse(localStorage.getItem("city"));

    retrievedCity.forEach(element => {
        var buttonEl = document.createElement("button");

        var nameString = element.display_name.split(",");
        buttonEl.textContent = nameString[0] + ", " + nameString[nameString.length - 1];
        historyEl.append(buttonEl);

        buttonEl.addEventListener("click", function () {
            var lon = element.lon;
            var lat = element.lat;
            constructURL(lat, lon);
            removeElements();
        } )

    })
    savedCity.concat(retrievedCity);
}

//initialises the button
retrieveStorage();



