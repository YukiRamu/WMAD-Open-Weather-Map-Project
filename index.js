/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ============== variables declaration ============== */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "24c4a9756532c3d6df0a376bc2cbe669";

//search 
const searchCity = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");

//getWeather function
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
let tempUnits = ""; // to use the parameter outside the function block

//F and C change function
let displayUnits = "";

//generateLocalDate function
let LocalCityOffsetMSec = "";
let formatLocalCityTime = "";
let unixPCtimeMSec = "";
let PCoffsetMsec = "";
let unixCurrentUTCMSec = "";
let unixLocalCityTimeMsec = "";
const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sepember', 'Octover', 'November', 'December'];
const WeekArray = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`,]
let displayTime = "";
let displayDate = "";

//unix converter
let unixTimeMSec = "";
let formatTime = "";
let PromiseSunrise = "";
let PromiseSunset = "";
let formatsunrise = "";
let formatsunset = "";

//animation
const openBtn = document.getElementById("openBtn");
const sideBar = document.getElementById("sideBar");
const countryList = document.getElementById("countryList");

/* ============== function declaration and call ============== */
//fetch API - get weather info
const getWeather = (cityName, units) => {

  tempCityName = cityName; // override the parameter when any button is clicked
  tempUnits = units // override the parameter when any button is clicked

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

      /* 1. Calculate local time and date */
      const generateLocalDate = async () => {
        //STEP1: create Date object
        const dateObj = new Date();
        //STEP2: calculate the time difference in msec between UTC and selected city
        LocalCityOffsetMSec = `${data.timezone}` * 1000;
        //STEP3: calculate current UTC unix time in msec
        /* #1 : obtain your PC unix time in msec (Timezone where you are in)*/
        unixPCtimeMSec = dateObj.getTime();
        /* #2 : obtain the time difference in msec between UTC and your PC time */
        PCoffsetMsec = dateObj.getTimezoneOffset() * 60000;
        /* #3 : obtain current UTC unix time */
        unixCurrentUTCMSec = unixPCtimeMSec + PCoffsetMsec;
        //STEP4: calculate local city unix time in msec
        unixLocalCityTimeMsec = unixCurrentUTCMSec + LocalCityOffsetMSec;
        //STEP5: initialize Date object and pass the parameter
        const localDateObj = new Date(unixLocalCityTimeMsec);
        //STEP6: convert unix time to readable time
        formatLocalCityTime = localDateObj.toLocaleString(`ja-JP`);

        /* Data modification: 0 padding for Jan, Feb and March*/
        if (formatLocalCityTime.substr(6, 1) == `/`) {
          formatLocalCityTime = formatLocalCityTime.substr(0, 5) + `0` + formatLocalCityTime.substr(5);
        } else {
          ;
        }

        /*  Prepare Display Data*/
        const dateParts = {
          time: formatLocalCityTime.substr(-8, 5),
          year: formatLocalCityTime.substr(0, 4),
          month: MonthArray[formatLocalCityTime.substr(6, 1) - 1],
          date: formatLocalCityTime.substr(8, 2), //get 2 digit to cover both 1 and 2 digits date
          daysOfWeek: WeekArray[localDateObj.getDay(unixLocalCityTimeMsec)],
        }

        displayTime = `${dateParts.time}`;
        displayDate = `${dateParts.month} ${dateParts.date}, ${dateParts.year} / ${dateParts.daysOfWeek}`;

        return displayDate, displayTime;
      }

      /* 2. Convert unix time (second) to human-readable time (sunrise/sunset) */
      const unixConverter = async (unixtime) => {
        unixTimeMSec = `${unixtime}` * 1000; //convert sec to msec
        const unixObj = new Date(unixTimeMSec); //create object and pass the parameter
        formatTime = unixObj.toLocaleString(`ja-JP`); //convert unix time to readable time
        return formatTime;
      }

      //Unix converter call and Promise handling : prepare sunset and sunrise
      PromiseSunrise = unixConverter(`${data.sys.sunrise}`); // return Promise
      PromiseSunrise.then((data) => { //get Promise result
        formatsunrise = data.substring(10); //get the time only
        return formatsunrise;
      })
      PromiseSunset = unixConverter(`${data.sys.sunset}`); // return Promise
      PromiseSunset.then((data) => { //get Promise result
        formatsunrset = data.substring(10); //get the time only
        return formatsunset;
      })

      /* 3. Insert HTML tags and display data -- version 1 */
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
