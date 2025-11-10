// Settings Page
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = './signup.html';
}

// Display user info
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userEmail').textContent = currentUser.email;

// Edit Profile
document.getElementById('editProfileBtn').addEventListener('click', () => {
    const newName = prompt('Enter new name:', currentUser.name);
    if (newName && newName.trim()) {
        currentUser.name = newName.trim();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in all users
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            allUsers[userIndex].name = newName.trim();
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
        
        document.getElementById('userName').textContent = newName.trim();
        alert('Profile updated successfully!');
    }
});

// Language Change
window.changeLanguage = function(lang) {
    localStorage.setItem('selectedLanguage', lang);
    alert(`Language changed to ${lang}. Refresh to see changes.`);
};

// Save Land Details
document.getElementById('saveLandBtn').addEventListener('click', () => {
    const landDetails = {
        soilType: document.getElementById('soilType').value,
        region: document.getElementById('region').value,
        landSize: document.getElementById('landSize').value
    };
    
    localStorage.setItem('landDetails', JSON.stringify(landDetails));
    alert('Land details saved successfully!');
});

// Load Land Details
const savedLand = JSON.parse(localStorage.getItem('landDetails'));
if (savedLand) {
    document.getElementById('soilType').value = savedLand.soilType || 'loamy';
    document.getElementById('region').value = savedLand.region || '';
    document.getElementById('landSize').value = savedLand.landSize || '';
}

// Theme and logout functionality removed as they are now handled in the dashboard navigation
