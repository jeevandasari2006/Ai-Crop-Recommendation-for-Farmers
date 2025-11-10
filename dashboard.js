// Check if user is logged in
const currentUserData = localStorage.getItem('currentUser');
console.log('Current user data from localStorage:', currentUserData);
if (!currentUserData) {
    console.log('No current user data found in localStorage');
    // Check if we just came from signup by looking at the referrer
    console.log('Document referrer:', document.referrer);
    if (document.referrer && document.referrer.includes('signup.html')) {
        console.log('Just came from signup, waiting a moment...');
        // Wait a moment and check again
        setTimeout(() => {
            const currentUserDataRetry = localStorage.getItem('currentUser');
            if (!currentUserDataRetry) {
                console.log('Still no user data, redirecting to signup...');
                window.location.assign('./signup.html');
            } else {
                console.log('Found user data on retry');
                initializeDashboard(currentUserDataRetry);
            }
        }, 1000);
    } else {
        console.log('Not from signup, redirecting to signup...');
        window.location.assign('./signup.html');
    }
} else {
    initializeDashboard(currentUserData);
}

function initializeDashboard(currentUserData) {
    try {
        const currentUser = JSON.parse(currentUserData);
        console.log('Current user:', currentUser);
        if (!currentUser) {
            console.log('Parsed user data is null');
            window.location.assign('./signup.html');
            return;
        }
        // Display user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = currentUser.name.split(' ')[0];
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.assign('./signup.html');
    }
}

// Display user name
const userNameEl = document.getElementById('userName');
if (userNameEl) {
    userNameEl.textContent = currentUser.name.split(' ')[0];
}

// Particles animation
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

// Debug: Log when script finishes loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard DOM loaded');
});
