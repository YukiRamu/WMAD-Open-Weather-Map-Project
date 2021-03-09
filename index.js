/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ======= variables declaration ======= */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "facca3484f4808eeb90bb82accbee7b1";
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
  console.log(`${url}${cityName}&appid=${apiKey}`); //****** DELETE LATER check url

  fetch(`${url}${cityName}&units=${units}&appid=${apiKey}`) //fetch API with input value and API key
    .then((response) => {
      if (!response.ok) { //check response status (200~299)
        throw error(`Fetch API failed`);
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
     
      //insert HTML tags and display data
      const createHTML = () => {
        console.log(displayUnits)
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
      createHTML();
      console.log(data); //****** DELETE LATER check data
      console.log(`${data.sys.sunrise}`.slice(0, 4))//****** UTC DELETE LATER check data
      console.log(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`); //****** DELETE LATER check data
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
  getWeather(searchCity.value); //pass the input city value
});

//Show Vancouver weather by default
window.addEventListener("load", () => {
  getWeather("Vancouver"); //pass "Vancouver" 
})

/* =============== To be added ================ */
//Temperature units change button

//Sunset Sunrise GetDate functions
