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
let tempCityName = ""; // for auto-refresh
let tempUnits = ""; // for auto-refresh + change units
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

let count = 0;

/* ============== function declaration and call ============== */
//fetch API - get weather info
const getWeather = (cityName, units) => {

  //counter
  count += 1;
  console.log("getWeather is called " + count + " times");
  //counter

  tempCityName = cityName; // override the parameter for auto-refresh
  tempUnits = units // override the parameter when the combination of auto-refresh and unit change happens

  console.log("I'm in getWeather() function. tempUnits is  " + tempUnits);
  console.log(`${url}${cityName}&units=${units}&appid=${apiKey}`);

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

      //change display units (Celsius vs Fahrenheit)
      if (units == "metric") {
        displayUnits = "°C";
      } else if (units == "imperial") {
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
        displayTime = `${dateParts.hour} : ${dateParts.min}`;
        displayDate = `${dateParts.month} ${dateParts.date}, ${dateParts.year} / ${dateParts.daysOfWeek}`;

        return displayDate, displayTime;

        //time shit calc
        console.log(` ${data.timezone}` / 3600 + " hours"); // -28800 second: will be deleted
        /* ============================================================================== */
        //get date and time
        // hour = dateObj.getHours().toString().padStart(2, `0`); //0 padding when needed
        // min = dateObj.getMinutes().toString().padStart(2, `0`); //0 padding when needed

        // year = dateObj.getFullYear();
        // month = MonthArray[dateObj.getMonth()];
        // date = dateObj.getDate().toString().padStart(2, `0`); //0 padding when needed
        // daysOfWeek = WeekArray[dateObj.getDay()];
        /* ============================================================================== */
        console.log(`current time is ${displayDate}, ${displayTime}`) //will be deleted : check data
      }

      /* 2. Convert unix time to human-readable time (sunrise/sunset) */
      const unixConverter = async (unixtime) => {
        const unixtimeToMilliSec = `${unixtime}` * 1000; //convert sec to millsec
        const unixObj = new Date(unixtimeToMilliSec); //create object and pass the parameter
        let formatTime = unixObj.toLocaleString(`ja-JP`); //convert unix time to readable time
        return formatTime;
      }

      //Unix converter call and Promise handling : prepare sunset and sunrise
      const PromiseSunrise = unixConverter(`${data.sys.sunrise}`); // return Promise
      PromiseSunrise.then((data) => { //get Promise result
        formatsunrise = data.substring(10); //get the time only
      })
      const PromiseSunset = unixConverter(`${data.sys.sunset}`); // return Promise
      PromiseSunset.then((data) => { //get Promise result
        formatsunrset = data.substring(10); //get the time only
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
          setTimeout(resolve, 120000); //millseconds: always fullfilled mil
        });
      };

      /* 5. Auto-refresh after the 2-mins wait */
      const refresh = async (refreshUnit) => {
        console.log("I'm refreshing " + refreshUnit)
        if (`!${tempCityName} == "Vancouver"`) { //not vancouver
          getWeather(`${tempCityName}`, `${refreshUnit}`);
        }
        else { //vancouver
          getWeather(`Vancouver`, `${refreshUnit}`);
        }
      }

      /* 6. temperature unit change */
      fahrenheit.addEventListener("click", () => {
        refresh("imperial");
      })
      celsius.addEventListener("click", () => {
        refresh("metric");
      })

      // call function asynchronously
      const processAll = async () => {
        await generateLocalDate();
        await displayData();
        await wait();
        console.log("after wait tempUnits is " + `${tempUnits}`);
        await refresh(`${tempUnits}`);
      }
      processAll();
    })

    .catch(() => {
      console.error(`Something went wrong. Weather Forecast failed to be loaded.`);
    })
}

/* ============== call getWeather function ============== */
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
    getWeather(searchCity.value, `metric`); //call main function
    searchCity.value = ""; //clear user city search field
  }
});

//Show Vancouver weather in default
window.addEventListener("DOMContentLoaded", () => {
  getWeather(`Vancouver`, `metric`); //call main function : Default
})