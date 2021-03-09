/* Yuki Matsubara Morning Class WMAD2 Mid-term */
/* ======= variables declaration ======= */
//API
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "facca3484f4808eeb90bb82accbee7b1";

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
const pressure = document.getElementById("pressure");

//animation
const openBtn = document.getElementById("openBtn");
const sideBar = document.getElementById("sideBar");

/* ======= function declaration ======= */
//fetch API - get weather info
const getWeather = (cityName) => {
  console.log(`${url}${cityName}&appid=${apiKey}`); //****** DELETE LATER check url

  fetch(`${url}${cityName}&appid=${apiKey}`) //fetch API with input value and API key
    .then((response) => {
      if (!response.ok) { //check response status (200~299)
        throw error(`Fetch API failed`);
      }
      else {
        return response.json(); //convert to JSON
      }
    })
    .then((data) => {
      //insert HTML tags and display data
      const createHTML = () => {
        city_country.innerHTML = `${data.name}, ${data.sys.country}`; //location
        sunrise.innerHTML = `<span>Sunrise: </span>${data.sys.sunrise}`; //sunrise 
        sunset.innerHTML = `<span>Sunset: </span>${data.sys.sunset}`; //sunset
        icon.innerHTML = `${data.weather[0].icon}`; //icon  --- need image
        temperature.innerHTML = `${data.main.temp}`; //main temperature
        description.innerHTML = `${data.weather[0].main}`; //description ---array
        feels_like.innerHTML = `${data.main.feels_like}`; //feels like
        humidity.innerHTML = `${data.main.humidity}`; //humidity
        pressure.innerHTML = `${data.main.pressure}`; //pressure
      }
      createHTML();
      console.log(data); //****** DELETE LATER check data
    })
    .catch(() => {
      console.error(`Something went wrong. Weather Forecast failed to be loaded.`);
    })
}


/* ======= call functions ======= */
//Open side search bar
openBtn.addEventListener ("click", () => {
  sideBar.style.width = "18%";
})

//Show data when search button is clicked
searchBtn.addEventListener("click", () => {
  getWeather(searchCity.value); //pass the input city value
});

//Show Vancouver weather by default
window.addEventListener("load", () => {
  getWeather("Vancouver"); //pass "Vancouver" 
})