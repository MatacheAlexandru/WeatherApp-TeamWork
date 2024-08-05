import {
  getWeatherByCoordinates,
  getReverseGeocoding,
  getWeatherByCityName,
  getWeatherForecastByCityName
} from '../apiOpenWeather.js';
import { setBackgroundForCity } from './backgroundImage.js';
import { fetchAdditionalWeatherData } from './additionalWeather.js';

export function displayWeatherDataOnCard(data) {
  const cityNameElement = document.getElementById('city-name');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const minTempElement = document.getElementById('min-temp');
  const maxTempElement = document.getElementById('max-temp');
  const weatherCardElement = document.getElementById('weather-card');
  const forecastContainer = document.getElementById('forecast-container');
  const chartContainer = document.getElementById('chart-container');

  if (
    cityNameElement &&
    temperatureElement &&
    descriptionElement &&
    humidityElement &&
    minTempElement &&
    maxTempElement &&
    weatherCardElement
  ) {
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `${data.main.temp} °C`;
    descriptionElement.textContent = `${data.weather[0].description}`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    minTempElement.textContent = `${data.main.temp_min} °C`;
    maxTempElement.textContent = `${data.main.temp_max} °C`;

    setBackgroundForCity(data.name);
    
    if (forecastContainer) {
      forecastContainer.style.display = 'none';
    }
    if (chartContainer) {
      chartContainer.style.display = 'none';
    }
  } else {
    console.error('One or more elements not found in the DOM');
  }
  fetchAdditionalWeatherData(data.name);
}

export function displayFiveDayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const chartContainer = document.getElementById('chart-container');
  forecastContainer.innerHTML = ''; 

  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) { 
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-day');

      const date = new Date(forecast.dt * 1000);
      const dateString = date.toLocaleDateString();

      forecastElement.innerHTML = `
        <h3>${dateString}</h3>
        <p>Min: ${forecast.main.temp_min} °C</p>
        <p>Max: ${forecast.main.temp_max} °C</p>
        <p>${forecast.weather[0].description}</p>
      `;

      forecastContainer.appendChild(forecastElement);
    }
  });

  if (forecastContainer) {
    forecastContainer.style.display = 'block';
  }
  if (chartContainer) {
    chartContainer.style.display = 'block';
  }
}

export async function fetchAndDisplayWeatherForCity(city) {
  try {
    const data = await getWeatherByCityName(city);
    displayWeatherDataOnCard(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

export async function fetchAndDisplayWeatherForLocation(lat, lon) {
  try {
    const data = await getWeatherByCoordinates(lat, lon);
    const locationData = await getReverseGeocoding(lat, lon);
    data.name = locationData[0].name;
    displayWeatherDataOnCard(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

export function initializeWeatherCard() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchAndDisplayWeatherForLocation(latitude, longitude);
      },
      error => {
        console.error('Error getting location:', error);
        fetchAndDisplayWeatherForCity('București');
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    fetchAndDisplayWeatherForCity('București');
  }

  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  const showChartButton = document.getElementById('show-chart');
  const chartContent = document.getElementById('chart-content');

  if (todayButton) {
    todayButton.addEventListener('click', () => {
      const city = document.getElementById('city-name').textContent;
      fetchAndDisplayWeatherForCity(city);
      todayButton.focus();
    });
  }

  if (fiveDayButton) {
    fiveDayButton.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      try {
        const data = await getWeatherForecastByCityName(city);
        displayFiveDayForecast(data);
        fiveDayButton.focus();
      } catch (error) {
        console.error('Error fetching 5-day forecast data:', error);
      }
    });
  }

  if (showChartButton) {
    showChartButton.addEventListener('click', () => {
      chartContent.innerHTML = '<p>Aici va fi afișat graficul cu vremea.</p>';
      showChartButton.focus();
    });
  }
}
