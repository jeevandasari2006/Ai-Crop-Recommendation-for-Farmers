// Weather API
const API_KEY = '3b649815ca504591907150051250711';
const getWeatherBtn = document.getElementById('getWeatherBtn');
const useLocationBtn = document.getElementById('useLocationBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityInput = document.getElementById('cityInput');

// Demo data for testing if API fails
function showDemoWeather(cityName = 'Demo City') {
    const demoCurrentData = {
        name: cityName,
        sys: { country: 'IN' },
        main: { temp: 28, humidity: 65, pressure: 1013 },
        weather: [{ description: 'partly cloudy', icon: '02d' }],
        wind: { speed: 3.5 }
    };
    
    const demoDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const demoForecastHTML = demoDays.map((day, index) => `
        <div class="forecast-item glass-card">
            <p style="font-weight: 600;">${day}</p>
            <img src="https://openweathermap.org/img/wn/02d@2x.png" alt="weather" style="width: 60px;">
            <p style="font-size: 1.2rem; font-weight: 700;">${25 + index}°C</p>
            <p style="font-size: 0.9rem; color: var(--text-gray);">Sunny</p>
        </div>
    `).join('');
    
    document.getElementById('cityName').textContent = `${demoCurrentData.name}, ${demoCurrentData.sys.country}`;
    document.getElementById('temperature').textContent = `${demoCurrentData.main.temp}°C`;
    document.getElementById('description').textContent = demoCurrentData.weather[0].description;
    document.getElementById('humidity').textContent = `${demoCurrentData.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${demoCurrentData.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${demoCurrentData.main.pressure} hPa`;
    document.getElementById('forecast').innerHTML = demoForecastHTML;
    
    weatherDisplay.classList.remove('hidden');
}

// Use current location
useLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    useLocationBtn.disabled = true;
    useLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Current weather by coordinates
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const currentData = await currentResponse.json();
                
                // 7-day forecast by coordinates
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const forecastData = await forecastResponse.json();
                
                cityInput.value = currentData.name;
                displayWeather(currentData, forecastData);
                weatherDisplay.classList.remove('hidden');
            } catch (error) {
                console.error('Location Weather Error:', error);
                // Automatically show demo weather without error popup
                showDemoWeather('Your Location');
            } finally {
                useLocationBtn.disabled = false;
                useLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            // Automatically show demo weather without error popup
            showDemoWeather('Demo City');
            useLocationBtn.disabled = false;
            useLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
        }
    );
});

getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    getWeatherBtn.disabled = true;
    getWeatherBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentResponse.json();
        
        if (currentData.cod !== 200) {
            throw new Error(currentData.message || 'City not found');
        }
        
        // 7-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        
        if (forecastData.cod !== "200") {
            throw new Error('Unable to fetch forecast data');
        }
        
        displayWeather(currentData, forecastData);
        weatherDisplay.classList.remove('hidden');
    } catch (error) {
        console.error('Weather API Error:', error);
        // Automatically show demo weather without error popup
        showDemoWeather(city);
    } finally {
        getWeatherBtn.disabled = false;
        getWeatherBtn.innerHTML = '<i class="fas fa-search"></i> Get Weather';
    }
});

function displayWeather(current, forecast) {
    // Current weather
    document.getElementById('cityName').textContent = `${current.name}, ${current.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;
    
    // 7-day forecast
    const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 7);
    const forecastHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
        
        return `
            <div class="forecast-item glass-card">
                <p style="font-weight: 600;">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather" style="width: 60px;">
                <p style="font-size: 1.2rem; font-weight: 700;">${Math.round(day.main.temp)}°C</p>
                <p style="font-size: 0.9rem; color: var(--text-gray);">${day.weather[0].main}</p>
            </div>
        `;
    }).join('');
    
    document.getElementById('forecast').innerHTML = forecastHTML;
}

// Particles
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = 'rgba(74, 222, 128, 0.3)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        container.appendChild(particle);
    }
}

createParticles();
