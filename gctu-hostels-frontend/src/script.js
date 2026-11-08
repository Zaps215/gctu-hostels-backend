const SignupForm = document.getElementById('signupForm');
const errorDisplay = document.getElementById('error-message');
const selectedRole = new URLSearchParams(window.location.search).get('role') === 'manager'
    ? 'manager'
    : 'student';
// OTP Modal variables
let otpTimerInterval = null;
let otpTimeLeft = 600; // 10 minutes in seconds

// 1. Role Parameter Detection & Dynamic UI updates on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const subHeader = document.querySelector('.underHeader');
    const usernameInput = document.getElementById('Username');
    const loginLink = document.getElementById('showLoginFromLoginBtn');

    if (selectedRole === 'manager') {
        if (header) header.textContent = 'Manager Registration';
        if (subHeader) subHeader.textContent = 'Manager accounts are created by an administrator. Contact support to request access.';
        if (usernameInput) usernameInput.placeholder = 'Hostel Name (e.g. Unidaz)';

        if (SignupForm) {
            SignupForm.innerHTML = `
                <div style="text-align: center; padding: 20px 10px;">
                    <i class="fas fa-building-user fa-3x" style="color: #3498db; margin-bottom: 15px;"></i>
                    <p style="color: #444; font-size: 15px; line-height: 1.6;">
                        Hostel manager accounts are provisioned directly by GCTU Hostels Administration. Please contact support or sign in if you already have your credentials.
                    </p>
                    <div style="margin-top: 25px;">
                        <a href="login.html?role=manager" class="btn-primary" style="display: block; width: 100%; text-decoration: none; padding: 12px 0; background: #3498db; color: white; border-radius: 6px; text-align: center;">
                            Go to Manager Sign In
                        </a>
                    </div>
                </div>
            `;
        }

    } else {
        if (header) header.textContent = 'Student Registration';
        if (subHeader) subHeader.textContent = 'Create your student account';
        if (usernameInput) usernameInput.placeholder = 'Index Number';
    }

    if (loginLink) {
        loginLink.href = `login.html?role=${selectedRole}`;
    }
});

// Toggle password visibility
function setupToggles() {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');
    const toggleConfirm = document.querySelector('#toggleConfirm');
    const confirmPassword = document.querySelector('#confirmPassword');
    
    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    if (toggleConfirm && confirmPassword) {
        toggleConfirm.addEventListener('click', function() {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

setupToggles();


// Add this function here
function checkPasswordRequirements(password) {
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const elements = {
        length: document.getElementById('req-length'),
        upper: document.getElementById('req-upper'),
        lower: document.getElementById('req-lower'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special')
    };
    
    for (const [key, element] of Object.entries(elements)) {
        if (requirements[key]) {
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    }
    
    return requirements.length && requirements.upper && requirements.lower && requirements.number && requirements.special;
}

const signupPassword = document.getElementById('password');
if (signupPassword) {
    signupPassword.addEventListener('input', (e) => {
        checkPasswordRequirements(e.target.value);
    });
}

function updateOtpTimerDisplay() {
    const minutes = Math.floor(otpTimeLeft / 60);
    const seconds = otpTimeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerDisplay = document.getElementById('otpTimerDisplay');
    if (timerDisplay) timerDisplay.innerHTML = `Time remaining: ${display}`;
}

function startOtpTimer() {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    otpTimeLeft = 600;
    updateOtpTimerDisplay();
    document.getElementById('verifyOtpBtn').disabled = false;
    document.getElementById('resendOtpBtn').style.opacity = '0.5';
    document.getElementById('resendOtpBtn').disabled = true;
    document.getElementById('otpExpiredMessage').style.display = 'none';

    otpTimerInterval = setInterval(() => {
        if (otpTimeLeft <= 0) {
            clearInterval(otpTimerInterval);
            document.getElementById('verifyOtpBtn').disabled = true;
            document.getElementById('resendOtpBtn').style.opacity = '1';
            document.getElementById('resendOtpBtn').disabled = false;
            document.getElementById('otpExpiredMessage').style.display = 'block';
            document.getElementById('otpTimerDisplay').innerHTML = 'Time remaining: 00:00';
        } else {
            otpTimeLeft--;
            updateOtpTimerDisplay();
        }
    }, 1000);
}   

//show OTP modal
function maskEmail(email) {
    if (!email) return 'user@example.com';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
        return `${localPart[0]}***@${domain}`;
    }
    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];
    const maskedLocal = `${firstChar}****${lastChar}`;
    return `${maskedLocal}@${domain}`;
}
function showOtpModal(email) {
    document.getElementById('otpEmailDisplay').innerText = maskEmail(email);
    document.getElementById('otpCode').value = '';
    document.getElementById('otpModal').classList.add('show');
    startOtpTimer();
}

//hide OTP modal
function hideOtpModal() {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    document.getElementById('otpModal').classList.remove('show');
}

//hide OTP modal
async function verifyOtp() {
    const email = document.getElementById('email').value.trim();
    const code = document.getElementById('otpCode').value.trim();
    
    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-digit code');
        return;
    }
    
    const verifyBtn = document.getElementById('verifyOtpBtn');
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = 'Verifying...';
    
    try {
        const response = await fetch(`${API_CONFIG.AUTH_API}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, code })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Account created successfully! Please login.');
            hideOtpModal();
            window.location.href = `login.html?role=${selectedRole}`;
        } else {
            alert(data.error || 'Verification failed');
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = 'Verify';
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Verification failed');
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = 'Verify';
    }
}
 //resend OTP
async function resendOtp() {
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('Username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const resendBtn = document.getElementById('resendOtpBtn');
    resendBtn.disabled = true;
    resendBtn.innerHTML = 'Sending...';
    
    try {
        const response = await fetch(`${API_CONFIG.AUTH_API}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                fullName,
                 username,
                  email,
                   password,
                    role: 'student'
                })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            startOtpTimer(); // Reset timer
            alert('New OTP sent to your email');
        } else {
            alert(data.error || 'Failed to resend OTP');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to resend OTP');
    } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Resend Code';
    }
}


// Signup form handler
SignupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('Username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    errorDisplay.innerText = "";

    if (!fullName || !username || !email || !password || !confirmPassword) {
        errorDisplay.innerText = "All fields are required.";
        return;
    }
    
    if (!checkPasswordRequirements(password)) {
    errorDisplay.innerText = 'Password does not meet requirements';
    return;
}

    if (password !== confirmPassword) {
        errorDisplay.innerText = "Passwords do not match! Try again.";
        return;
    }

const submitBtn = document.getElementById('signupBtn');
//loading spinner

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';

    try {
        // Send to backend API
        const response = await fetch(`${API_CONFIG.AUTH_API}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fullName, username, email, password, role: 'student' })
        });

        const data = await response.json();

        if (response.ok) {


 showOtpModal(email);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-check"></i> Register';
        } else {
            errorDisplay.innerText = data.error || "Failed to send OTP";
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-check"></i> Register';
        }
    } catch (err) {
        console.error("Error:", err);
        errorDisplay.innerText = "Connection Failed! Please try again.";
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-check"></i> Register';
    }
});

   // EVENT LISTENERS for OTP Modal
document.getElementById('verifyOtpBtn').addEventListener('click', verifyOtp);
document.getElementById('resendOtpBtn').addEventListener('click', resendOtp);
document.getElementById('cancelOtpBtn').addEventListener('click', hideOtpModal);

// Close modal when clicking outside
document.getElementById('otpModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('otpModal')) {
        hideOtpModal();
    }
});