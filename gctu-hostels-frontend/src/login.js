const loginForm = document.getElementById('loginForm');
const errorDisplay = document.getElementById('error-message');
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

//login loading spinner
// Define elements for the loading spinner
const loginBtn = document.getElementById('LoginBtn');
const loginIcon = document.getElementById('login-icon');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');
const selectedRole = new URLSearchParams(window.location.search).get('role') === 'manager'
    ? 'manager'
    : 'student';

// 1. Role Parameter Detection & Dynamic UI updates
document.addEventListener('DOMContentLoaded', () => {
    const headerText = document.getElementById('header');
    const signupLink = document.getElementById('showSignupFromSignupBtn');
    const usernameInput = document.getElementById('Username');
    const inputIcon = document.getElementById('inputIcon');

    if (selectedRole === 'manager') {
        if (headerText) headerText.textContent = 'Welcome Back';
        if (usernameInput) usernameInput.placeholder = 'Hostel Name (e.g. Unidaz)';
        if (inputIcon) inputIcon.className = 'fas fa-building input-icon';
    } else {
        if (headerText) headerText.textContent = 'Welcome Back';
        if (usernameInput) usernameInput.placeholder = 'Enter your Index Number';
        if (inputIcon) inputIcon.className = 'fas fa-user-graduate input-icon';
    }

    if (signupLink) {
        signupLink.href = `signup.html?role=${selectedRole}`;
    }
});
// Login loading spinner helper function
function setLoading(isLoading) {
  if (isLoading) {
    loginBtn.disabled = true;
    loginIcon.style.display = 'none';       
    loginText.textContent = 'Logging in...'; 
    loginSpinner.style.display = 'inline-block'; 
  } else {
    loginBtn.disabled = false;
    loginIcon.style.display = 'inline-block'; 
    loginText.textContent = 'Login';         
    loginSpinner.style.display = 'none';     
  }
}


// Toggle password visibility
if (togglePassword && password) {
    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}



// Login form handler - SIMPLE VERSION
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    setLoading(true); // <--- START THE SPINNER HERE

    const inputUsername = document.getElementById('Username').value.trim();
    const inputPassword = document.getElementById('password').value;

    if (errorDisplay) errorDisplay.innerText = "";


    try {
        console.log("Sending login request to backend...");
        // Send to backend API (NOT localStorage)
        const response = await fetch(`${API_CONFIG.AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword,
                role: selectedRole
            })
        });

        const data = await response.json();

        if (response.ok && data.user) {
            const user = data.user;
            const userName = user.fullName || user.username || 'User';
            const userRole = user.role;

            if (userRole !== 'manager' && userRole !== 'student') {
                throw new Error('The server returned an unsupported account role.');
            }

            // Dynamic redirect based on database role
            const targetRedirect = userRole === 'manager' ? 'add-hostel.html' : 'homepage.html';
            const loginPopup = document.getElementById('loginPopup');
            const popupMessage = document.getElementById('popupMessage');

            if (loginPopup && popupMessage) {
                popupMessage.textContent = userRole === 'manager'
                    ? `Welcome back, ${userName}! Redirecting to Manager Portal...`
                    : `Welcome back, ${userName}! Redirecting to Homepage...`;

                loginPopup.classList.add('show');

                document.getElementById('popupOkBtn').onclick = function() {
                    window.location.replace(targetRedirect);
                };
                setTimeout(() => {
                    window.location.replace(targetRedirect);
                }, 1500);
            } else {
                window.location.replace(targetRedirect);
            }
        } else {
            if (errorDisplay) {
                errorDisplay.innerText = data.error || data.message || "Login failed! Please check your details.";
            }
        }
    } catch (err) {
        console.error("Error:", err);
        if (errorDisplay) {
            errorDisplay.innerText = "Connection Failed! Please try again";
        }
    } finally {
        setLoading(false); // Restores button state safely using inner elements
    }
});