/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ======= variables declaration ======= */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "24c4a9756532c3d6df0a376bc2cbe669";
let units = "metric"; //default = celsius

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
let tempCityName = ""; // for auto-refresh
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

      /* 1. Get local time and date */
      const generateLocalDate = async () => {
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

        console.log(dateParts); // for data check purpose

        //time shit calc
        console.log(` ${data.timezone}` / 3600 + " hours"); // -28800 second

        /* ============================================================================== */
        //get date and time
        // hour = dateObj.getHours().toString().padStart(2, `0`); //0 padding when needed
        // min = dateObj.getMinutes().toString().padStart(2, `0`); //0 padding when needed

        // year = dateObj.getFullYear();
        // month = MonthArray[dateObj.getMonth()];
        // date = dateObj.getDate().toString().padStart(2, `0`); //0 padding when needed
        // daysOfWeek = WeekArray[dateObj.getDay()];
        /* ============================================================================== */

        displayTime = `${dateParts.hour} : ${dateParts.min}`;
        displayDate = `${dateParts.month} ${dateParts.date}, ${dateParts.year} / ${dateParts.daysOfWeek}`;

        console.log(`current time is ${displayDate}, ${displayTime}`) //will be deleted : check data

        return displayDate, displayTime;
      }

      /* 2. Convert unix time to human readable time (sunrise/sunset) */
      const unixConverter = async (unixtime) => {
        const unixtimeToMilliSec = `${unixtime}` * 1000; //convert sec to millsec
        const unixObj = new Date(unixtimeToMilliSec); //create object and pass the parameter
        let formatTime = unixObj.toLocaleString(`ja-JP`); //convert unix time to readable time
        console.log("format time is " + formatTime);
        return formatTime;
      }
      //prepare sunset and sunrise
      const PromiseSunrise = unixConverter(`${data.sys.sunrise}`); // return Promise
      PromiseSunrise.then((data) => { //get Promise result
        console.log(data)
        formatsunrise = data.substring(10);
      })
      const PromiseSunset = unixConverter(`${data.sys.sunset}`); // return Promise
      PromiseSunset.then((data) => { //get Promise result
        console.log(data)
        formatsunrset = data.substring(10);
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

      /* 4. Wait 2 mins */
      const wait = async function () {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 5000);
        });
      };

      /* 5. Auto-refresh after the 2-mins wait */
      const refresh = async () => {
        if (`!${tempCityName} == "Vancouver"`) { //not vancouver
          getWeather(`${tempCityName}`);
        }
        else { //vancouver
          getWeather("Vancouver");
        }
      }

      // call function asynchronously
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
