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

    errorDisplay.innerText = "";


    try {
        console.log("Sending login request to backend...");
        // Send to backend API (NOT localStorage)
        const response = await fetch(`${API_CONFIG.AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username: inputUsername, password: inputPassword })
        });

        const data = await response.json(); 
         console.log("Response:", data);

        if (response.ok) {
            // Save user to localStorage (for frontend state)
            /*localStorage.setItem('registeredUser', JSON.stringify(data.user));*/


        // Show success popup
       const loginPopup = document.getElementById('loginPopup');
        const popupMessage = document.getElementById('popupMessage');
        
        const userName = data.user.fullName || data.user.username || 'Student';
        popupMessage.innerHTML = `Welcome back, ${userName}! Redirecting to Homepage...`;
        
        loginPopup.classList.add('show');
        
        document.getElementById('popupOkBtn').onclick = function() {
            window.location.replace('homepage.html');
        }; 
        // Redirect immediately - no popup
/*window.location.href = 'homepage.html';*/
    } else {
        errorDisplay.innerText = data.error || "Login failed! Please check your details.";
    }
 } catch (err) {
        console.error("Error:", err);
        errorDisplay.innerText = "Connection Failed! Please try again";
    } finally {
        // Always re-enable the button so user can try again
        const loginBtn = document.getElementById('LoginBtn');
        setLoading(false); // <--- STOP THE SPINNER HERE (Runs on success or fail)
if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-arrow-right-to-bracket"></i> Login';
    }
    }
});