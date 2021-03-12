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
let tempCityName = "";
let city_country = document.getElementById("location");
let localTime = document.getElementById("localTime");
let localDate = document.getElementById("localDate");
let sunrise = document.getElementById("sunrise");
let sunset = document.getElementById("sunset");
let icon = document.getElementById("icon");
let temperature = document.getElementById("temperature");
let description = document.getElementById("description");
let feels_like = document.getElementById("feels_like");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let displayUnits = "";
let year = "";
const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sepember', 'Octover', 'November', 'December'];
let monthNum = "";
let month = "";
let date = "";
const WeekArray = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`,]
let dayOfWeek = "";
let hour = "";
let min = "";
let displayTime = "";
let displayDate = "";
let dateObj = new Date();

//animation
const openBtn = document.getElementById("openBtn");
const sideBar = document.getElementById("sideBar");

/* ======= function declaration and call ======= */
//fetch API - get weather info
const getWeather = (cityName) => {
  tempCityName = cityName; // override the parameter for auto-refresh

  console.log("the city to be refreshed is " + tempCityName);
  console.log(`#1: ${url}${cityName}&appid=${apiKey}`); //****** DELETE LATER check url

  fetch(`${url}${cityName}&units=${units}&appid=${apiKey}`) //fetch API with input value and API key
    .then((response) => {
      if (!response.ok) { //check response status (ok:200~299)
        alert(`A city is not found. : HTTPS status = ${response.status}`)
        throw error(response.statusText);
      }
      else {
        return response.json(); //convert to JSON
      }
    })
    .then((data) => {
      console.log(data) //will be deleted : check data

      //change units (Celsius vs Fahrenheit)
      if (units = "metric") {
        displayUnits = "°C";
      } else if (units = "imperial") {
        displayUnits = "°F";
      }

      /* 0. Get local time and date */
      const generateLocalDate = async () => {
        //get date and time
        hour = dateObj.getHours().toString().padStart(2, `0`); //0 padding when needed
        min = dateObj.getMinutes().toString().padStart(2, `0`); //0 padding when needed

        year = dateObj.getFullYear();
        month = monthArray[dateObj.getMonth()];
        date = dateObj.getDate().toString().padStart(2, `0`); //0 padding when needed
        daysOfWeek = WeekArray[dateObj.getDay()];

        displayTime = `${hour} : ${min}`;
        displayDate = `${month} ${date}, ${year} / ${daysOfWeek}`;

        console.log(`${displayDate}, ${displayTime}`) //will be deleted : check data

        return displayDate, displayTime;
      }

      /* 1. Insert HTML tags and display data */
      const displayData = async () => {
        city_country.innerHTML = `${data.name}, ${data.sys.country}`; //location
        localTime.innerHTML = `${displayTime}`; //local time
        localDate.innerHTML = `${displayDate}`; //local date
        sunrise.innerHTML = `<span>Sunrise: </span>${data.sys.sunrise}`; //sunrise 
        sunset.innerHTML = `<span>Sunset: </span>${data.sys.sunset}`; //sunset
        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">`; //icon
        temperature.innerHTML = `${Math.round(data.main.temp)}${displayUnits}`; //main temperature
        description.innerHTML = `${data.weather[0].main}`; //description ---array
        feels_like.innerHTML = `<span>Feels like: </span>${Math.round(data.main.feels_like)}${displayUnits}`; //feels like
        humidity.innerHTML = `<span>Humidity: </span>${data.main.humidity} %`; //humidity
        pressure.innerHTML = `<span>Pressure: </span>${data.main.pressure} hPa`; //pressure
      }

      /* 2. Wait 2 mins */
      const wait = async function () {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 5000);
        });
      };

      /* 3. Auto-refresh after the 2-mins wait */
      const refresh = async () => {
        if (`!${tempCityName} == "Vancouver"`) { //not vancouver
          getWeather(`${tempCityName}`);
        }
        else { //vancouver
          getWeather("Vancouver");
        }
      }

      const processAll = async () => {
        await generateLocalDate();
        await displayData();
        await wait();
        await refresh();
      }
      processAll();
    })

    .catch(() => {
      console.error(`Something went wrong. Weather Forecast failed to be loaded.`);
    })
}

/* ======= call getWeather function ======= */
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
    searchCity.value = ""; //clear user input field
  }
});

//Show Vancouver weather by default
window.addEventListener("DOMContentLoaded", () => {
  getWeather("Vancouver"); //pass "Vancouver"
})

/* =============== Under const ================ */
//Temperature units change button

//Sunset Sunrise GetDate functions
