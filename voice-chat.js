// Voice Circle and Chat
const voiceCircle = document.getElementById('voiceCircle');
const voiceStatus = document.getElementById('voiceStatus');
const micIcon = document.getElementById('micIcon');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatMessages = document.getElementById('chatMessages');

let isListening = false;
let recognition;

// Speech Recognition Setup
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = localStorage.getItem('selectedLanguage') || 'en-US';
}

// Toggle Voice Recognition
function toggleVoice() {
    if (!recognition) {
        alert('Speech recognition not supported');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        voiceCircle.classList.remove('active');
        voiceCircle.classList.add('idle');
        voiceStatus.textContent = 'Tap to speak or type below';
        isListening = false;
    } else {
        recognition.start();
        voiceCircle.classList.remove('idle');
        voiceCircle.classList.add('active');
        voiceStatus.textContent = 'Listening...';
        isListening = true;
    }
}

if (recognition) {
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        sendMessage();
    };
    
    recognition.onend = () => {
        isListening = false;
        voiceCircle.classList.remove('active');
        voiceCircle.classList.add('idle');
        voiceStatus.textContent = 'Tap to speak or type below';
    };
}

voiceCircle.addEventListener('click', toggleVoice);
voiceBtn.addEventListener('click', toggleVoice);

// Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    chatInput.value = '';
    
    setTimeout(() => {
        const response = generateFriendlyResponse(message);
        addMessage(response, false);
        
        // Text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            window.speechSynthesis.speak(utterance);
        }
    }, 1000);
}

// Generate friendly, GPT-like responses
function generateFriendlyResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        const greetings = [
            "Hello there! 🌟 I'm your friendly farming assistant. How can I help you today?",
            "Hi! It's great to see you! What farming questions do you have for me?",
            "Hey there! I'm here and ready to help with all your agricultural needs!"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return "I'm here to help you with farming advice! I can assist with crop recommendations, weather insights, soil health, pest control, and general agricultural tips. Just ask me anything about farming! 🌱";
    }
    
    // Crop recommendations
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
        const crops = [
            "Based on your soil conditions, I recommend planting rice or wheat this season. They're great for beginners!",
            "Tomatoes and peppers are excellent choices if you're looking for high-value crops this season.",
            "Consider legumes like beans or lentils to naturally enrich your soil with nitrogen!",
            "Leafy greens like spinach and lettuce grow quickly and can provide multiple harvests."
        ];
        return crops[Math.floor(Math.random() * crops.length)];
    }
    
    // Weather related
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('sun')) {
        const weather = [
            "The current weather is perfect for crop rotation. Consider adding legumes to your fields!",
            "Make sure to check the 7-day forecast before planning any outdoor farming activities.",
            "If you're expecting heavy rain, ensure your fields have proper drainage to prevent waterlogging.",
            "Sunny days are great for photosynthesis! Just make sure your plants have enough water."
        ];
        return weather[Math.floor(Math.random() * weather.length)];
    }
    
    // Soil related
    if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('compost')) {
        const soil = [
            "To maximize yield, ensure proper irrigation and use organic fertilizers like compost or manure.",
            "Consider getting your soil tested to understand its pH and nutrient levels better.",
            "Cover crops during the off-season can improve soil structure and add nutrients naturally.",
            "Mulching helps retain moisture and suppress weeds while slowly adding organic matter to soil."
        ];
        return soil[Math.floor(Math.random() * soil.length)];
    }
    
    // Disease/Pest related
    if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('bug')) {
        const disease = [
            "For disease prevention, maintain proper plant spacing and avoid overhead watering.",
            "Neem oil is a natural pesticide that's safe for beneficial insects.",
            "Crop rotation is one of the best ways to prevent soil-borne diseases.",
            "Early detection is key! Regularly inspect your plants for signs of pests or diseases."
        ];
        return disease[Math.floor(Math.random() * disease.length)];
    }
    
    // General farming tips
    if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('suggestion')) {
        const tips = [
            "Water your plants early in the morning to reduce evaporation and prevent fungal diseases.",
            "Companion planting can naturally deter pests. Try growing marigolds near tomatoes!",
            "Keep a farming journal to track what works best in your specific conditions.",
            "Start seeds indoors to get a head start on the growing season."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Check if the question is agriculture-related
    const agricultureKeywords = [
        'crop', 'plant', 'grow', 'farming', 'farm', 'soil', 'weather', 'rain', 'sun', 'irrigation',
        'fertilizer', 'compost', 'pest', 'disease', 'bug', 'harvest', 'seed', 'tractor', 'field',
        'agriculture', 'cultivation', 'yield', 'pesticide', 'herbicide', 'organic', 'nitrogen',
        'phosphorus', 'potassium', 'ph', 'season', 'monsoon', 'winter', 'summer', 'market',
        'price', 'income', 'profit', 'drainage', 'mulch', 'companion', 'rotation', 'greenhouse'
    ];
    
    const isAgricultureRelated = agricultureKeywords.some(keyword => 
        lowerMessage.includes(keyword)
    );
    
    if (!isAgricultureRelated) {
        return "I'm focused on helping with agriculture-related questions. Your question doesn't seem to be related to farming or agriculture. Please ask about crops, soil, weather, pests, or other farming topics! 🌱";
    }
    
    // Default friendly responses for agriculture-related questions
    const defaultResponses = [
        "That's an interesting question! Based on my knowledge, I'd suggest considering crop rotation to maintain soil health.",
        "Great question! Proper irrigation and organic fertilizers can really boost your yields.",
        "I understand what you're asking. Maintaining proper plant spacing can help prevent many common issues.",
        "Thanks for asking! For the best results, I recommend checking your local weather forecast and soil conditions.",
        "I'm here to help! Consider using natural pest control methods to protect your crops.",
        "That's a smart farming question! Keeping detailed records of your planting and harvest dates can help improve yields each season.",
        "Excellent point! Companion planting can naturally enhance growth and deter pests."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
