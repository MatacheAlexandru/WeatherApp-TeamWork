const t="https://api.openweathermap.org/data/2.5";async function e(t){try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(t){throw console.error("Fetch API Error:",t),t}}async function o(o){try{const r=`${t}/weather?q=${o}&appid=c28b86768a874c70b1ecd1343e8f0f24&units=metric`;return await e(r)}catch(t){throw console.error(`Error getting weather by city name "${o}":`,t),t}}async function r(o,r){try{const n=`${t}/weather?lat=${o}&lon=${r}&appid=c28b86768a874c70b1ecd1343e8f0f24&units=metric`;return await e(n)}catch(t){throw console.error(`Error getting weather by coordinates (lat: ${o}, lon: ${r}):`,t),t}}async function n(t,o){try{const r=`http://api.openweathermap.org/geo/1.0/reverse?lat=${t}&lon=${o}&appid=c28b86768a874c70b1ecd1343e8f0f24`;return await e(r)}catch(e){throw console.error(`Error getting reverse geocoding for coordinates (lat: ${t}, lon: ${o}):`,e),e}}async function a(t){try{const e=await fetch(t);if(!e.ok)throw new Error(`Network response was not ok. Status: ${e.status}`);return await e.json()}catch(t){throw console.error("Fetch API Error:",t),t}}async function c(t,e=1,o=3){try{const r=`https://pixabay.com/api/?key=24587351-f51ecbfdd1a1ed72c58205b43&q=${t}&image_type=photo&per_page=${o}&page=${e}`;return console.log("Fetching image from URL:",r),await a(r)}catch(e){throw console.error(`Error fetching random images with query "${t}":`,e),e}}async function i(t){try{const e=await c(t,1,3),o=document.getElementById("background-image");e&&e.hits&&e.hits.length>0&&o?(o.style.backgroundImage=`url(${e.hits[0].webformatURL})`,o.style.backgroundSize="cover",o.style.backgroundPosition="center",o.style.height="100vh",o.style.width="100vw",o.style.position="fixed",o.style.zIndex="-1"):console.error("No images found or background element not found.")}catch(t){console.error("Error fetching image from Pixabay API:",t)}}function s(t){const e=document.getElementById("city-name"),o=document.getElementById("temperature"),r=document.getElementById("description"),n=document.getElementById("humidity"),a=document.getElementById("weather-card");e&&o&&r&&n&&a?(e.textContent=t.name,o.textContent=`Temperature: ${t.main.temp} °C`,r.textContent=`Description: ${t.weather[0].description}`,n.textContent=`Humidity: ${t.main.humidity}%`,i(t.name)):console.error("One or more elements not found in the DOM")}async function d(t){try{s(await o(t))}catch(t){console.error("Error fetching weather data:",t)}}async function u(t,e){try{const o=await r(t,e),a=await n(t,e);o.name=a[0].name,s(o)}catch(t){console.error("Error fetching weather data:",t)}}document.addEventListener("DOMContentLoaded",(async()=>{document.getElementById("search-form").addEventListener("submit",(function(t){t.preventDefault();const e=document.getElementById("city-input").value.trim();e&&d(e)})),navigator.geolocation?navigator.geolocation.getCurrentPosition((t=>{const{latitude:e,longitude:o}=t.coords;u(e,o)}),(t=>{console.error("Error getting location:",t),d("București")})):(console.error("Geolocation is not supported by this browser"),d("București"))}));
//# sourceMappingURL=index.931e1911.js.map
