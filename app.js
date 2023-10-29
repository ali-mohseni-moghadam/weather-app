import { getWeekDay } from "./utils/customeDate.js";
import getWeatherData from "./utils/httpReq.js";
import { removeModal, showModal } from "./utils/modal.js";

const searchInput = document.querySelector("input");
const searchbutton = document.querySelector("button");
const weatherContainer = document.querySelector("#weather");
const locationIcon = document.querySelector("#location");
const forecastContainer = document.querySelector("#forecast");
const modalButton = document.querySelector("#modal-button");
// const loader = document.querySelector("#loader");

const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSX = `
                <h1>${data.name}, ${data.sys.country}</h1>
                <div id="main">
                    <img alt="weather icon" src="https://api.openweathermap.org/img/w/${
                      data.weather[0].icon
                    }.png" />
                    <span>${data.weather[0].main}</span>
                    <p>${Math.round(data.main.temp)} °C</p>
                </div>
                <div id="info">
                    <p>Humidity: <span>${data.main.humidity} %</span></p>
                    <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
                </div>
            `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  const newData = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  newData.forEach((i) => {
    const forecastJSX = `
        <div>
            <img alt="weather icon" src="https://api.openweathermap.org/img/w/${
              i.weather[0].icon
            }.png" />
            <h3>${getWeekDay(i.dt)}</h3>
            <p>${Math.round(i.main.temp)} °C</p>
            <span>${i.weather[0].main}</span>
        </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;
  if (!cityName) {
    showModal("pls enter city name");
    return;
  }

  const currenData = await getWeatherData("current", cityName);
  renderCurrentWeather(currenData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const currenData = await getWeatherData("current", position.coords);
  renderCurrentWeather(currenData);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  showModal(error);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("You'r browser does not support geolocation");
  }
};

const initHandler = async () => {
  const currenData = await getWeatherData("current", "tehran");
  renderCurrentWeather(currenData);
  const forecastData = await getWeatherData("forecast", "tehran");
  renderForecastWeather(forecastData);
};

searchbutton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
