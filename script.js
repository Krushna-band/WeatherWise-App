const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

const APIKey = 'c468e61fecf007d111fe6a93419f6982';

search.addEventListener('click', () => {
    const cityInput = document.querySelector('.search-box input');
    const city = cityInput.value.trim();

    if (city === '') {
        alert("Please enter a city name.");
        return;
    }

    fetchWeatherByCity(city);
});

window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(json => {
                        if (json.cod !== 200) {
                            alert("Failed to detect location weather.");
                            return;
                        }

                        updateWeatherUI(json);
                    })
                    .catch(error => {
                        console.error('Error (location fetch):', error);
                    });
            },
            error => {
                console.warn("Geolocation error:", error);
            }
        );
    }
};


function fetchWeatherByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod !== 200) {
                alert("City not found. Please enter a valid city name.");
                return;
            }

            updateWeatherUI(json);
        })
        .catch(error => {
            console.error('Error (manual fetch):', error);
            alert("Failed to fetch weather data. Please try again later.");
        });
}


function updateWeatherUI(json) {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    const weatherMain = json.weather[0].main;

    switch (weatherMain) {
        case 'Clear':
            image.src = 'images/clear.png';
            break;
        case 'Rain':
            image.src = 'images/rain.png';
            break;
        case 'Clouds':
            image.src = 'images/cloud.png';
            break;
        case 'Mist':
        case 'Haze':
        case 'Fog':
            image.src = 'images/mist.png';
            break;
        default:
            image.src = 'images/cloud.png';
    }

    temperature.innerHTML = Math.round(json.main.temp)+`<span>°C</span>`;
    description.innerHTML = json.weather[0].description;
    humidity.innerHTML = json.main.humidity;
    wind.innerHTML = Math.round(json.wind.speed) +`Km/h`;

    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';
}
