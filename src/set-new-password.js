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
        // NO extra brace here! The fetch is inside try block
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