// ============ TRANSLATIONS ============
const translations = {
    en: {
        subtitle: "Your AI Farming Assistant",
        emailLabel: "Email",
        passwordLabel: "Password",
        nameLabel: "Full Name",
        phoneLabel: "Phone Number",
        confirmPasswordLabel: "Confirm Password",
        signupBtn: "Sign Up",
        switchToLogin: "Already have an account? Contact support for login assistance."
    },
    hi: {
        subtitle: "आपका एआई खेती सहायक",
        emailLabel: "ईमेल",
        passwordLabel: "पासवर्ड",
        nameLabel: "पूरा नाम",
        phoneLabel: "फ़ोन नंबर",
        confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
        signupBtn: "साइन अप",
        switchToLogin: "पहले से खाता है? सहायता के लिए समर्थन से संपर्क करें।"
    },
    ta: {
        subtitle: "உங்கள் AI விவசாய உதவியாளர்",
        emailLabel: "மின்னஞ்சல்",
        passwordLabel: "கடவுச்சொல்",
        nameLabel: "முழு பெயர்",
        phoneLabel: "தொலைபேசி எண்",
        confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        signupBtn: "பதிவு செய்க",
        switchToLogin: "ஏற்கனவே கணக்கு உள்ளதா? உதவிக்கு ஆதரவைத் தொடர்பு கொள்ளவும்."
    },
    te: {
        subtitle: "మీ AI వ్యవసాయ సహాయకుడు",
        emailLabel: "ఇమెయిల్",
        passwordLabel: "పాస్‌వర్డ్",
        nameLabel: "పూర్తి పేరు",
        phoneLabel: "ఫోన్ నంబర్",
        confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
        signupBtn: "సైన్ అప్",
        switchToLogin: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ కోసం సహాయాన్ని సంప్రదించండి."
    },
    mr: {
        subtitle: "तुमचा AI शेती सहाय्यक",
        emailLabel: "ईमेल",
        passwordLabel: "पासवर्ड",
        nameLabel: "पूर्ण नाव",
        phoneLabel: "फोन नंबर",
        confirmPasswordLabel: "पासवर्ड पुष्टी करा",
        signupBtn: "साइन अप",
        switchToLogin: "आधीच खाते आहे? लॉगिनसाठी समर्थनाशी संपर्क साधा."
    }
};

// ============ LANGUAGE FUNCTIONS ============
function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updateLanguage(lang);
}

function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update all text elements
    const elements = {
        subtitle: 'subtitle',
        emailLabel: 'emailLabel',
        passwordLabel: 'passwordLabel',
        nameLabel: 'nameLabel',
        phoneLabel: 'phoneLabel',
        confirmPasswordLabel: 'confirmPasswordLabel'
    };

    for (const [key, id] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el && t[key]) {
            el.textContent = t[key];
        }
    }

    // Update buttons
    const signupBtn = document.getElementById('signupBtn');
    
    if (signupBtn && t.signupBtn) signupBtn.textContent = t.signupBtn;
}

// ============ AUTH FUNCTIONS ============
function saveUserSession(userData) {
    console.log('Saving user session:', userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('User session saved');
}

// ============ SIGNUP FORM ============
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            console.log('Signup form submitted with:', { name, email, phone, password, confirmPassword });
            
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
            console.log('Existing users:', allUsers);
            const emailExists = allUsers.find(u => u.email === email);
            
            if (emailExists) {
                alert('Email already registered! Please contact support for assistance.');
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
            
            console.log('Creating new user:', newUser);
            
            // Save user
            allUsers.push(newUser);
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            
            // Set as current user
            saveUserSession(newUser);
            
            console.log('Redirecting to dashboard...');
            // Add a small delay to ensure data is saved
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 500);
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        }
    });
}

// ============ PARTICLES ANIMATION ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = Math.random() > 0.5 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// ============ INIT ============
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    updateLanguage(savedLang);
    createParticles();
});
