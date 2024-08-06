import {
  fetchAndDisplayWeatherForCity,
  fetchAndDisplayWeatherForLocation,
} from './weathercard.js';

function addToFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert(`${city} has been added to your favorites.`);
  } else {
    alert(`${city} is already in your favorites.`);
  }
}

function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  if (favoritesList) {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.classList.add('remove-favorite');
      removeBtn.addEventListener('click', () => {
        removeFromFavorites(city);
      });
      li.appendChild(removeBtn);
      favoritesList.appendChild(li);
    });
  }
}

function removeFromFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(favorite => favorite !== city);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

export function initializeSearch() {
  const cityInput = document.getElementById('city-input');
  const starIcon = document.getElementById('star-icon');
  const locationIcon = document.getElementById('location-icon');

  if (cityInput) {
    cityInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
          fetchAndDisplayWeatherForCity(city);
        }
      }
    });
  } else {
    console.warn('City input element not found.');
  }

  if (starIcon) {
    starIcon.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
        addToFavorites(city);
      }
    });
  } else {
    console.warn('Star icon element not found.');
  }

  if (locationIcon) {
 
    locationIcon.addEventListener('click', async () => {
      // Adăugăm async aici pentru a putea folosi await

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            const cityName = await fetchAndDisplayWeatherForLocation(
              latitude,
              longitude
            );
            if (cityName) {
              loadAndRenderChart(cityName);
            }
          },
          async error => {
            console.error('Error getting location:', error);
            const cityName = await fetchAndDisplayWeatherForCity('București');
            if (cityName) {
              loadAndRenderChart(cityName);
            }
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        const cityName = await fetchAndDisplayWeatherForCity('București'); // Aici trebuie să fie o funcție async pentru a folosi await
        if (cityName) {
          loadAndRenderChart(cityName);
        }
      }
    });
  } else {
    console.warn('Location icon element not found.');
  }

  displayFavorites(); // Display favorites when the page loads
}
