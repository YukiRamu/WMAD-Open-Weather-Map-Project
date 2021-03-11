/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ======= variables declaration ======= */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "24c4a9756532c3d6df0a376bc2cbe669";
let units = "metric"; //default celsius

//search 
const searchCity = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");

//display weather
let city_country = document.getElementById("location");
let sunrise = document.getElementById("sunrise");
let sunset = document.getElementById("sunset");
let icon = document.getElementById("icon");
let temperature = document.getElementById("temperature");
let description = document.getElementById("description");
let feels_like = document.getElementById("feels_like");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let displayUnits = "";

//animation
const openBtn = document.getElementById("openBtn");
const sideBar = document.getElementById("sideBar");

/* ======= function declaration ======= */
//fetch API - get weather info
const getWeather = (cityName) => {
  console.log(`#1: ${url}${cityName}&appid=${apiKey}`); //****** DELETE LATER check url

  fetch(`${url}${cityName}&units=${units}&appid=${apiKey}`) //fetch API with input value and API key
    .then((response) => {
      console.log("#2: " + response);
      if (!response.ok) { //check response status (ok:200~299)
        alert(`A city is not found. : HTTPS status = ${response.status}`)
        throw error(response.statusText);
      }
      else {
        return response.json(); //convert to JSON
      }
    })
    .then((data) => {

      //change units (Celsius vs Fahrenheit)
      if (units = "metric") {
        displayUnits = "°C";
      } else if (units = "imperial") {
        displayUnits = "°F";
      }

      /* 1. Insert HTML tags and display data */
      const displayData = async () => {
        city_country.innerHTML = `${data.name}, ${data.sys.country}`; //location
        sunrise.innerHTML = `<span>Sunrise: </span>${data.sys.sunrise}`; //sunrise 
        sunset.innerHTML = `<span>Sunset: </span>${data.sys.sunset}`; //sunset
        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">`; //icon
        temperature.innerHTML = `${data.main.temp}${displayUnits}`; //main temperature
        description.innerHTML = `${data.weather[0].main}`; //description ---array
        feels_like.innerHTML = `<span>Feels like: </span>${data.main.feels_like}${displayUnits}`; //feels like
        humidity.innerHTML = `<span>Humidity: </span>${data.main.humidity} %`; //humidity
        pressure.innerHTML = `<span>Pressure: </span>${data.main.pressure} hPa`; //pressure
      }
      console.log("#3: done creating HTML");

      /* 2. Wait 2 mins */
      const wait = async function () {
        console.log("#4, I'm waiting for 2 mins")
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 120000);
        });
      };

      /* 3. Auto-refresh after the 2-mins wait */
      const refresh = async () => {
        alert(`city name is ${cityName}`);
        if (`!${cityName} == "Vancouver"`) { //not vancouver
          console.log("Hi refreshing input city");
          getWeather(`${cityName}`);
        }
        else { //vancouver
          console.log("#4: Refreshing Vancouver weather");
          getWeather("Vancouver");
        }
      }

      const processAll = async () => {
        console.log("function 1 starts");
        await displayData();
        console.log("function 2 starts");
        await wait();
        console.log("function 3 starts");
        await refresh();
      }
     processAll();
    })

    .catch(() => {
      console.error(`Something went wrong. Weather Forecast failed to be loaded.`);
    })
}

/* ======= call functions ======= */
//Open side search bar
openBtn.addEventListener("click", () => {
  sideBar.style.width = "20%";
})

//Show data when search button is clicked
searchBtn.addEventListener("click", () => {
  //validation check (not string or null)
  if (!isNaN(searchCity.value) || searchCity.value == null) {
    alert("Please enter a valid city name. Note that Numbers and Empty are not allowed");
  } else {
    getWeather(searchCity.value); //pass the input city value
    //searchCity.value = ""; //clear input
  }
});

//Show Vancouver weather by default
window.addEventListener("DOMContentLoaded", () => {
  getWeather("Vancouver"); //pass "Vancouver"
})

/* =============== Under const ================ */
//Temperature units change button

//Sunset Sunrise GetDate functions
