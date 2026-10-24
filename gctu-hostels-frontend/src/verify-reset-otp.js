const form = document.getElementById('verifyOtpForm');
const errorDisplay = document.getElementById('error-message');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval = null;
let timeLeft = 600;

const email = sessionStorage.getItem('resetEmail');

if (!email) {
    window.location.href = 'forgot-password.html';
}

function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];
    return `${firstChar}****${lastChar}@${domain}`;
}

document.getElementById('emailDisplay').innerText = maskEmail(email);

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `Time remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = 'Time remaining: 00:00';
            timerDisplay.classList.add('expired');
            document.getElementById('verifyBtn').disabled = true;
            errorDisplay.innerText = 'Code expired. Please request a new code.';
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

startTimer();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = document.getElementById('otpCode').value.trim();
    errorDisplay.innerText = '';
    
    if (!code || code.length !== 6) {
        errorDisplay.innerText = 'Please enter a valid 6-digit code';
        return;
    }
    
    const submitBtn = document.getElementById('verifyBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    try {
        const response = await fetch('https://gctu-hostels-backend.onrender.com/api/verify-reset-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('resetVerified', 'true');
            window.location.href = 'set-new-password.html';
        } else {
            errorDisplay.innerText = data.error || 'Invalid or expired code';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Code';
        }
    } catch (err) {
        errorDisplay.innerText = 'Cannot connect to server';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Code';
    }
});