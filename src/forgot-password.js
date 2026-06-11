const form = document.getElementById('forgotPasswordForm');
const errorDisplay = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    errorDisplay.innerText = '';

    const submitBtn = form.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        const response = await fetch('https://gctu-hostels-backend.onrender.com/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('resetEmail', email);
            window.location.href = 'verify-reset-otp.html';
        } else {
            errorDisplay.innerText = data.error || 'Failed to send reset code';
        }
    } catch (err) {
        errorDisplay.innerText = 'Cannot connect to server';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Code';
    }
});