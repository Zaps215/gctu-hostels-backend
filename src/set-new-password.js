const form = document.getElementById('setPasswordForm');
const errorDisplay = document.getElementById('error-message');

const isVerified = sessionStorage.getItem('resetVerified');
const email = sessionStorage.getItem('resetEmail');

if (!isVerified || !email) {
    window.location.href = 'forgot-password.html';
}

function setupToggles() {
    const togglePassword = document.querySelector('#togglePassword');
    const passwordField = document.querySelector('#newPassword');
    const toggleConfirm = document.querySelector('#toggleConfirm');
    const confirmField = document.querySelector('#confirmPassword');
    
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    if (toggleConfirm && confirmField) {
        toggleConfirm.addEventListener('click', function() {
            const type = confirmField.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

setupToggles();

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

const newPassword = document.getElementById('newPassword');
newPassword.addEventListener('input', (e) => {
    checkPasswordRequirements(e.target.value);
});

// Show popup function
function showSuccessPopup() {
    const popup = document.getElementById('set-new-passwordPopup');
    if (popup) {
        popup.classList.add('show');
    }
}

// Hide popup function
function hideSuccessPopup() {
    const popup = document.getElementById('set-new-passwordPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    errorDisplay.innerText = '';
    
    if (!checkPasswordRequirements(password)) {
        errorDisplay.innerText = 'Password does not meet requirements';
        return;
    }
    
    if (password !== confirmPassword) {
        errorDisplay.innerText = 'Passwords do not match';
        return;
    }
    
    const submitBtn = document.getElementById('resetBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    
    try {
}
        const response = await fetch('https://gctu-hostels-backend.onrender.com/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
             // Show custom popup instead of alert
            showSuccessPopup();
            
            // Clear session storage
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetVerified');
            
            // Set up OK button to redirect
            const okBtn = document.getElementById('popupOkBtn');
            if (okBtn) {
                okBtn.onclick = function() {
                    hideSuccessPopup();
                    window.location.href = 'login.html';
                };
            }
        } else {
            errorDisplay.innerText = data.error || 'Reset failed';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Reset Password';
        }
    } catch (err) {
        errorDisplay.innerText = 'Cannot connect to server';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Reset Password';
    }
});