// ============ LOGIN FORM ============
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login form submitted with email:', email);
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Get all users from storage
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
            console.log('Checking against users:', allUsers);
            
            // Find user with matching email and password
            const user = allUsers.find(u => u.email === email && u.password === password);
            
            if (!user) {
                alert('Invalid email or password. Please try again.');
                return;
            }
            
            console.log('Login successful for user:', user);
            
            // Save user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            console.log('Redirecting to dashboard...');
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 500);
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
}
