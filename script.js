// ============ API KEY ============
const WEATHER_API_KEY = '095e513a9b284d738f4134318252510';

// ============ USER SESSION ============
let currentUser = null;

function saveUserSession(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function clearUserSession() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name.split(' ')[0]}`;
        }
        if (signupBtn) {
            signupBtn.style.display = 'none';
        }
    }
}

function updateUIForLoggedOutUser() {
    authScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
    if (signupBtn) {
        signupBtn.style.display = 'flex';
    }
}

// ============ DOM ELEMENTS ============
const authScreen = document.getElementById('authScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupForm = document.getElementById('showSignupForm');
const showLoginForm = document.getElementById('showLoginForm');

const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');

// Auth Buttons & Modals
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const signupSubmitBtn = document.getElementById('signupSubmitBtn');

// ============ AUTH SCREEN TOGGLE ============
showSignupForm.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLoginForm.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// ============ LOGIN FORM SUBMIT ============
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmailAuth').value;
    const password = document.getElementById('loginPasswordAuth').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if user exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const existingUser = allUsers.find(u => u.email === email);
    
    if (!existingUser) {
        alert('Account not found. Please sign up first!');
        return;
    }
    
    if (existingUser.password !== password) {
        alert('Incorrect password!');
        return;
    }
    
    // Save session and show main app
    saveUserSession(existingUser);
    alert(`Welcome back, ${existingUser.name}! 🌾`);
    
    // Clear form
    loginForm.reset();
});

// ============ SIGNUP FORM SUBMIT ============
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupNameAuth').value;
    const email = document.getElementById('signupEmailAuth').value;
    const phone = document.getElementById('signupPhoneAuth').value;
    const password = document.getElementById('signupPasswordAuth').value;
    const confirmPassword = document.getElementById('signupConfirmPasswordAuth').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Check if email exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const emailExists = allUsers.find(u => u.email === email);
    
    if (emailExists) {
        alert('Email already registered! Please login instead.');
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Set as current user
    saveUserSession(newUser);
    alert(`Account created successfully! Welcome, ${newUser.name}! 🌱`);
    
    // Clear form
    signupForm.reset();
});

// Voice Circle
const voiceCircle = document.getElementById('voiceCircle');
const voiceStatus = document.getElementById('voiceStatus');
const micIcon = document.getElementById('micIcon');

// Chat
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatMessages = document.getElementById('chatMessages');

// Modals
const featureBtns = document.querySelectorAll('.feature-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');
const modals = document.querySelectorAll('.modal');

// Theme
const themeOptions = document.querySelectorAll('.theme-option');

// Weather
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherDisplay = document.getElementById('weatherDisplay');

// Crop Suggestion
const getCropSuggestionsBtn = document.getElementById('getCropSuggestions');
const cropResults = document.getElementById('cropResults');
const cropList = document.getElementById('cropList');

// Disease Detection
const uploadArea = document.getElementById('uploadArea');
const diseaseImage = document.getElementById('diseaseImage');
const diseaseResult = document.getElementById('diseaseResult');
const uploadedImage = document.getElementById('uploadedImage');

// Income Estimation
const calculateIncomeBtn = document.getElementById('calculateIncome');
const incomeResult = document.getElementById('incomeResult');

// Document Upload
const documentUploadArea = document.getElementById('documentUploadArea');
const documentFile = document.getElementById('documentFile');
const uploadedFiles = document.getElementById('uploadedFiles');

// Speech Recognition
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

// ============ SETTINGS PANEL ============
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('active');
});

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
});

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.remove('active');
    }
});

// Settings Items
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        clearUserSession();
        alert('Logged out successfully!');
        settingsPanel.classList.remove('active');
    }
});

document.getElementById('profileBtn').addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login first!');
        settingsPanel.classList.remove('active');
        loginModal.classList.remove('hidden');
        return;
    }
    
    alert(`Profile Details:

Name: ${currentUser.name}
Email: ${currentUser.email}
Phone: ${currentUser.phone || 'Not provided'}`);
});

document.getElementById('editProfileBtn').addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login first!');
        settingsPanel.classList.remove('active');
        loginModal.classList.remove('hidden');
        return;
    }
    
    const newName = prompt('Enter new name:', currentUser.name);
    if (newName && newName.trim()) {
        currentUser.name = newName.trim();
        saveUserSession(currentUser);
        updateUIForLoggedInUser();
        alert('Profile updated successfully!');
    }
});

// ============ THEME TOGGLE ============
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const theme = option.dataset.theme;
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    });
});

// ============ MODAL HANDLING ============
featureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        document.getElementById(modalId).classList.remove('hidden');
    });
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.add('hidden');
    });
});

// Close modal when clicking outside
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// ============ AUTH SCREEN HANDLERS ============
if (loginBtn && typeof loginBtn !== 'undefined') {
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            alert(`Profile Details:

Name: ${currentUser.name}
Email: ${currentUser.email}
Phone: ${currentUser.phone || 'Not provided'}`);
        } else if (loginModal) {
            loginModal.classList.remove('hidden');
        }
    });
}

if (signupBtn && typeof signupBtn !== 'undefined') {
    signupBtn.addEventListener('click', () => {
        if (signupModal) signupModal.classList.remove('hidden');
    });
}

if (switchToSignup && typeof switchToSignup !== 'undefined') {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.add('hidden');
        if (signupModal) signupModal.classList.remove('hidden');
    });
}

if (switchToLogin && typeof switchToLogin !== 'undefined') {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupModal) signupModal.classList.add('hidden');
        if (loginModal) loginModal.classList.remove('hidden');
    });
}

if (loginSubmitBtn && typeof loginSubmitBtn !== 'undefined') {
    loginSubmitBtn.addEventListener('click', () => {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const existingUser = allUsers.find(u => u.email === email);
        
        if (!existingUser) {
            alert('Account not found. Please sign up first!');
            return;
        }
        
        if (existingUser.password !== password) {
            alert('Incorrect password!');
            return;
        }
        
        saveUserSession(existingUser);
        alert(`Welcome back, ${existingUser.name}! 🌾`);
        if (loginModal) loginModal.classList.add('hidden');
        
        if (document.getElementById('loginEmail')) document.getElementById('loginEmail').value = '';
        if (document.getElementById('loginPassword')) document.getElementById('loginPassword').value = '';
    });
}

if (signupSubmitBtn && typeof signupSubmitBtn !== 'undefined') {
    signupSubmitBtn.addEventListener('click', () => {
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const phone = document.getElementById('signupPhone')?.value;
        const password = document.getElementById('signupPassword')?.value;
        const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
        
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const emailExists = allUsers.find(u => u.email === email);
        
        if (emailExists) {
            alert('Email already registered! Please login instead.');
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
            return;
        }
        
        const newUser = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password,
            createdAt: new Date().toISOString()
        };
        
        allUsers.push(newUser);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        saveUserSession(newUser);
        alert(`Account created successfully! Welcome, ${newUser.name}! 🌱`);
        if (signupModal) signupModal.classList.add('hidden');
        
        ['signupName', 'signupEmail', 'signupPhone', 'signupPassword', 'signupConfirmPassword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    });
}

// ============ AUTH FUNCTIONALITY ============
loginBtn.addEventListener('click', () => {
    if (currentUser) {
        // If logged in, show profile
        alert(`Profile Details:

Name: ${currentUser.name}
Email: ${currentUser.email}
Phone: ${currentUser.phone || 'Not provided'}`);
    } else {
        // If not logged in, show login modal
        loginModal.classList.remove('hidden');
    }
});

signupBtn.addEventListener('click', () => {
    signupModal.classList.remove('hidden');
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('hidden');
    signupModal.classList.remove('hidden');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

loginSubmitBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login - Check if user exists in localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const existingUser = allUsers.find(u => u.email === email);
    
    if (!existingUser) {
        alert('Account not found. Please sign up first!');
        return;
    }
    
    if (existingUser.password !== password) {
        alert('Incorrect password!');
        return;
    }
    
    // Save current session
    saveUserSession(existingUser);
    
    // Success message
    alert(`Welcome back, ${existingUser.name}! 🌾`);
    loginModal.classList.add('hidden');
    
    // Clear form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
});

signupSubmitBtn.addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Check if email already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const emailExists = allUsers.find(u => u.email === email);
    
    if (emailExists) {
        alert('Email already registered! Please login instead.');
        signupModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Save to all users
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Set as current user
    saveUserSession(newUser);
    
    // Success message
    alert(`Account created successfully! Welcome to Agro Advisor AI, ${newUser.name}! 🌱`);
    signupModal.classList.add('hidden');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
});

// ============ VOICE CIRCLE & CHAT ============
let isListening = false;

voiceCircle.addEventListener('click', toggleVoiceRecognition);
voiceBtn.addEventListener('click', toggleVoiceRecognition);

function toggleVoiceRecognition() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        isListening = false;
        voiceCircle.classList.remove('active');
        voiceCircle.classList.add('idle');
        voiceStatus.textContent = 'Tap to speak or type below';
        micIcon.className = 'fas fa-microphone';
    } else {
        recognition.start();
        isListening = true;
        voiceCircle.classList.remove('idle');
        voiceCircle.classList.add('active');
        voiceStatus.textContent = 'Listening...';
        micIcon.className = 'fas fa-microphone-slash';
    }
}

if (recognition) {
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        sendChatMessage();
    };
    
    recognition.onend = () => {
        isListening = false;
        voiceCircle.classList.remove('active');
        voiceCircle.classList.add('idle');
        voiceStatus.textContent = 'Tap to speak or type below';
        micIcon.className = 'fas fa-microphone';
    };
}

// Chat functionality
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    chatInput.value = '';
    
    // Speak response if available
    setTimeout(() => {
        const responses = [
            "Based on your soil conditions and weather, I recommend planting rice or wheat this season. 🌾",
            "The current weather is perfect for crop rotation. Consider adding legumes to improve soil nitrogen.",
            "To maximize yield, ensure proper irrigation and use organic fertilizers every 2 weeks.",
            "Disease prevention tip: Keep your plants well-spaced for air circulation and avoid overhead watering.",
            "Market analysis shows good prices for cotton and corn this quarter. Would you like more details?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse);
        
        // Text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(randomResponse);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }, 1000);
}

sendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// ============ WEATHER FORECAST ============
getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const currentData = await currentResponse.json();
        
        if (currentData.cod !== 200) {
            throw new Error('City not found');
        }
        
        // 7-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        
        displayWeather(currentData, forecastData);
    } catch (error) {
        alert('Error fetching weather data: ' + error.message);
    }
});

function displayWeather(current, forecast) {
    const currentWeatherHTML = `
        <div class="current-weather">
            <h3>${current.name}, ${current.sys.country}</h3>
            <div class="weather-temp">${Math.round(current.main.temp)}°C</div>
            <div class="weather-desc">${current.weather[0].description}</div>
            <p>Humidity: ${current.main.humidity}% | Wind: ${current.wind.speed} m/s</p>
        </div>
    `;
    
    // Get daily forecasts (every 8th item = 24 hours)
    const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 7);
    
    const forecastHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        return `
            <div class="forecast-item">
                <p>${date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p>${Math.round(day.main.temp)}°C</p>
                <p style="font-size: 0.9rem;">${day.weather[0].main}</p>
            </div>
        `;
    }).join('');
    
    weatherDisplay.innerHTML = `
        ${currentWeatherHTML}
        <h3 style="color: var(--primary-blue); margin: 2rem 0 1rem;">7-Day Forecast</h3>
        <div class="forecast">${forecastHTML}</div>
    `;
}

// ============ CROP SUGGESTION ============
getCropSuggestionsBtn.addEventListener('click', () => {
    const soilType = document.getElementById('soilType').value;
    const region = document.getElementById('region').value;
    const landSize = document.getElementById('landSize').value;
    
    if (!region || !landSize) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulated crop recommendations
    const crops = [
        { name: 'Rice', suitability: 92, profit: 850 },
        { name: 'Wheat', suitability: 85, profit: 720 },
        { name: 'Cotton', suitability: 78, profit: 680 }
    ];
    
    cropList.innerHTML = crops.map(crop => `
        <div class="crop-item">
            <div>
                <strong style="color: var(--primary-green);">${crop.name}</strong>
                <p style="font-size: 0.9rem; color: var(--text-gray);">Suitability: ${crop.suitability}%</p>
            </div>
            <div style="text-align: right;">
                <strong style="color: var(--primary-blue);">$${crop.profit}/acre</strong>
            </div>
        </div>
    `).join('');
    
    cropResults.classList.remove('hidden');
    
    // Create profit chart
    createProfitChart(crops);
});

function createProfitChart(crops) {
    const canvas = document.getElementById('profitChart');
    const ctx = canvas.getContext('2d');
    
    if (window.profitChart) {
        window.profitChart.destroy();
    }
    
    window.profitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: crops.map(c => c.name),
            datasets: [{
                label: 'Expected Profit ($/acre)',
                data: crops.map(c => c.profit),
                backgroundColor: [
                    'rgba(74, 222, 128, 0.6)',
                    'rgba(96, 165, 250, 0.6)',
                    'rgba(251, 191, 36, 0.6)'
                ],
                borderColor: [
                    'rgba(74, 222, 128, 1)',
                    'rgba(96, 165, 250, 1)',
                    'rgba(251, 191, 36, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// ============ DISEASE DETECTION ============
uploadArea.addEventListener('click', () => diseaseImage.click());

diseaseImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadedImage.src = event.target.result;
        
        // Simulated AI detection
        setTimeout(() => {
            const diseases = [
                { name: 'Leaf Blight', cause: 'Fungal infection', treatment: 'Apply fungicide and remove affected leaves' },
                { name: 'Powdery Mildew', cause: 'High humidity', treatment: 'Improve air circulation and use sulfur-based fungicide' },
                { name: 'Bacterial Wilt', cause: 'Bacterial infection', treatment: 'Remove infected plants and avoid overhead watering' },
                { name: 'Healthy', cause: 'No disease detected', treatment: 'Continue regular care and monitoring' }
            ];
            
            const result = diseases[Math.floor(Math.random() * diseases.length)];
            
            document.getElementById('diseaseName').textContent = result.name;
            document.getElementById('diseaseCause').textContent = result.cause;
            document.getElementById('diseaseTreatment').textContent = result.treatment;
            
            diseaseResult.classList.remove('hidden');
        }, 1500);
    };
    reader.readAsDataURL(file);
});

// Save Report
document.getElementById('saveReport').addEventListener('click', () => {
    alert('Report saved successfully! You can access it from your profile.');
});

// ============ INCOME ESTIMATION ============
calculateIncomeBtn.addEventListener('click', () => {
    const crop = document.getElementById('incomeCrop').value;
    const area = document.getElementById('incomeArea').value;
    
    if (!area) {
        alert('Please enter area');
        return;
    }
    
    const incomeData = {
        rice: { yield: 2.5, price: 340 },
        wheat: { yield: 2.8, price: 290 },
        corn: { yield: 3.2, price: 310 },
        cotton: { yield: 1.8, price: 520 }
    };
    
    const data = incomeData[crop];
    const estimatedIncome = data.yield * data.price * area;
    
    incomeResult.classList.remove('hidden');
    
    const canvas = document.getElementById('incomeChart');
    const ctx = canvas.getContext('2d');
    
    if (window.incomeChart) {
        window.incomeChart.destroy();
    }
    
    window.incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Revenue', 'Costs', 'Net Profit'],
            datasets: [{
                data: [estimatedIncome, estimatedIncome * 0.4, estimatedIncome * 0.6],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(96, 165, 250, 0.6)'
                ],
                borderColor: '#1a1f35',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff', font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: `Estimated Net Income: $${(estimatedIncome * 0.6).toFixed(2)}`,
                    color: '#4ade80',
                    font: { size: 18, weight: 'bold' }
                }
            }
        }
    });
});

// ============ DOCUMENT UPLOAD ============
documentUploadArea.addEventListener('click', () => documentFile.click());

documentFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div>
            <i class="fas fa-file" style="color: var(--primary-green); margin-right: 0.5rem;"></i>
            <strong>${file.name}</strong>
            <small style="display: block; color: var(--text-muted);">${(file.size / 1024).toFixed(2)} KB</small>
        </div>
        <span style="color: var(--success);"><i class="fas fa-check-circle"></i> Uploaded</span>
    `;
    
    uploadedFiles.appendChild(fileItem);
});

// ============ PARTICLES ANIMATION ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = Math.random() > 0.5 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(96, 165, 250, 0.3)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ============ LOAD USER SESSION ON PAGE LOAD ============
window.addEventListener('DOMContentLoaded', () => {
    loadUserSession();
});