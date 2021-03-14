/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ============== variables declaration ============== */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "24c4a9756532c3d6df0a376bc2cbe669";

//search 
const searchCity = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");

//display weather
const city_country = document.getElementById("location");
const localTime = document.getElementById("localTime");
const localDate = document.getElementById("localDate");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const icon = document.getElementById("icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feels_like = document.getElementById("feels_like");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const celsius = document.getElementById("celsius");
const fahrenheit = document.getElementById("fahrenheit");
let tempCityName = ""; // to use the parameter outside the function block
let tempUnits = ""; // fto use the parameter outside the function block
let displayUnits = ""; // to change units
const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sepember', 'Octover', 'November', 'December']; // to generate local time
const WeekArray = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`,] // to generate local time
let displayTime = ""; // to generate local time
let displayDate = "";// to generate local time
let formatsunrise = ""; // for unix time converter
let formatsunset = ""; // for unix time converter

//animation
const openBtn = document.getElementById("openBtn");
const sideBar = document.getElementById("sideBar");
const countryList = document.getElementById("countryList");

/* ============== function declaration and call ============== */
//fetch API - get weather info
const getWeather = (cityName, units) => {

  tempCityName = cityName; // override the parameter when any button is clicked
  tempUnits = units // override the parameter when when any button is clicked

  fetch(`${url}${cityName}&units=${units}&appid=${apiKey}`) //fetch API with input value and API key
    .then((response) => {
      if (!response.ok) { //check response status (ok:200~299)
        alert(`A city is not found. : Https status = ${response.status}`)
        throw error(response.statusText);
      }
      else {
        return response.json(); //convert to JSON
      }
    })
    .then((data) => {
      console.log(data);

      //change display units (Celsius vs Fahrenheit)
      if (units == "metric") {
        displayUnits = "°C";
      } else if (units == "imperial") {
        displayUnits = "°F";
      }

      /* 1. Get local time and date */
      const generateLocalDate = async () => {
        /* ===================================Version 1 ================================ */
        //create a dateParts object
        const dateObj = new Date();
        const dateParts = {
          hour: dateObj.getHours().toString().padStart(2, `0`), //0 padding when needed
          min: dateObj.getMinutes().toString().padStart(2, `0`), //0 padding when needed
          year: dateObj.getFullYear(),
          month: MonthArray[dateObj.getMonth()],
          date: dateObj.getDate().toString().padStart(2, `0`), //0 padding when needed
          daysOfWeek: WeekArray[dateObj.getDay()],
        }
        displayTime = `${dateParts.hour} : ${dateParts.min}`;
        displayDate = `${dateParts.month} ${dateParts.date}, ${dateParts.year} / ${dateParts.daysOfWeek}`;
        /* ===================================Version 1 ================================ */

        // function calcTime(cit!y, offset) {
          //create Date object
          const dtObj = new Date();
          //calculate the time difference in msec between UTC and selected city
          const LocalCityOffsetMSec = `${data.timezone}` * 1000; //timezone: -25200 Van
          //calculate current UTC unix time in msec
          /* #1 : obtain your PC unix time in msec (Time where you are in)*/
          const unixPCtimeMSec = dtObj.getTime(); 
          /* #2 : obtain the time difference in msec between UTC and your PC time */
          const PCoffsetMsec = dtObj.getTimezoneOffset() * 60000;
          /* #3 : obtain current UTC unix time */
          const unixCurrentUTCMSec = unixPCtimeMSec + PCoffsetMsec;
          //calculate local city unix time in msec
          const unixLocalCityTimeMsec = unixCurrentUTCMSec + LocalCityOffsetMSec;

          //initialize Date object and pass a parameter
          const localDateObj = new Date(unixLocalCityTimeMsec);
          //convert unix time to readable time
          const formatLocalCityTime = localDateObj.toLocaleString(`ja-JP`); 
          console.log("The local city time is " + formatLocalCityTime);

          return formatLocalCityTime;
        // }
        // console.log(calcTime('Vancouver', '-8'))

        return displayDate, displayTime;

      }

      /* 2. Convert unix time (second) to human-readable time (sunrise/sunset) */
      const unixConverter = async (unixtime) => {
        const unixtimeMSec = `${unixtime}` * 1000; //convert sec to msec
        const unixObj = new Date(unixtimeMSec); //create object and pass the parameter
        const formatTime = unixObj.toLocaleString(`ja-JP`); //convert unix time to readable time
        return formatTime;
      }

      //Unix converter call and Promise handling : prepare sunset and sunrise
      const PromiseSunrise = unixConverter(`${data.sys.sunrise}`); // return Promise
      PromiseSunrise.then((data) => { //get Promise result
        formatsunrise = data.substring(10); //get the time only
        return formatsunrise;
      })
      const PromiseSunset = unixConverter(`${data.sys.sunset}`); // return Promise
      PromiseSunset.then((data) => { //get Promise result
        formatsunrset = data.substring(10); //get the time only
        return formatsunset;
      })

      /* 3. Insert HTML tags and display data */
      const displayData = async () => {
        city_country.innerHTML = `${data.name}, ${data.sys.country}`; //location
        localTime.innerHTML = `${displayTime}`; //local time
        localDate.innerHTML = `${displayDate}`; //local date
        sunrise.innerHTML = `<span>Sunrise: </span>${formatsunrise}`; //sunrise 
        sunset.innerHTML = `<span>Sunset: </span>${formatsunrset}`; //sunset
        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">`; //icon
        temperature.innerHTML = `${Math.round(data.main.temp)}${displayUnits}`; //main temperature
        description.innerHTML = `${data.weather[0].main}`; //description
        feels_like.innerHTML = `<span>Feels like: </span>${Math.round(data.main.feels_like)}${displayUnits}`; //feels like
        humidity.innerHTML = `<span>Humidity: </span>${data.main.humidity} %`; //humidity
        pressure.innerHTML = `<span>Pressure: </span>${data.main.pressure} hPa`; //pressure
      }

      // call function asynchronously
      const processAll = async () => {
        await generateLocalDate();
        await unixConverter();
        await displayData(); //need to be executed at the very last.
      }
      processAll();
    })

    .catch(() => {
      console.error(`Something went wrong. Weather Forecast failed to be loaded.`);
    })

  return tempCityName, tempUnits; // to use the parameters outside getWeather function block
}

/* ============== call getWeather function ============== */
//Show Vancouver weather in default
window.addEventListener("DOMContentLoaded", () => {
  getWeather(`Vancouver`, `metric`); //call main function : Default
})

//Open side search bar
openBtn.addEventListener("click", () => {
  sideBar.style.width = "20%";
  countryList.style.opacity = "1";
  countryList.style.transform = "translateY(-250%)";
})

//Show data when search button is clicked
searchBtn.addEventListener("click", () => {
  //validation check (not string or null)
  if (!isNaN(searchCity.value) || searchCity.value == null) {
    alert(`Please enter a valid city name. Note that Numbers and Empty are not allowed!`);
  } else {
    getWeather(searchCity.value, `${tempUnits}`); //call main function
    searchCity.value = ""; //clear user city search field for the next search
  }
});

//Fahrenheit - Celcius display change
fahrenheit.addEventListener("click", () => {
  getWeather(`${tempCityName}`, `imperial`); //call main function
})
celsius.addEventListener("click", () => {
  getWeather(`${tempCityName}`, `metric`); //call main function
})

/*Auto-refresh after the 2-mins wait */
const refresh = () => {
  getWeather(`${tempCityName}`, `${tempUnits}`); //dynamic parameter change
}
setInterval(refresh, 120000); //millsecond

