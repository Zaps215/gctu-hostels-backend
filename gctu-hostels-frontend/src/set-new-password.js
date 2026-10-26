const form = document.getElementById('setPasswordForm');
const errorDisplay = document.getElementById('error-message');
const email = sessionStorage.getItem('resetEmail');
const resetVerified = sessionStorage.getItem('resetVerified');

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
        if (!element) continue;
        element.classList.toggle('valid', requirements[key]);
        element.classList.toggle('invalid', !requirements[key]);
    }

    return requirements.length && requirements.upper && requirements.lower && requirements.number && requirements.special;
}

function setupToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('newPassword');
    const toggleConfirm = document.getElementById('toggleConfirm');
    const confirmPassword = document.getElementById('confirmPassword');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (toggleConfirm && confirmPassword) {
        toggleConfirm.addEventListener('click', function () {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

function showSuccessPopup() {
    const popup = document.getElementById('set-new-passwordPopup');
    if (popup) popup.classList.add('show');
}

function hideSuccessPopup() {
    const popup = document.getElementById('set-new-passwordPopup');
    if (popup) popup.classList.remove('show');
}

if (!email || !resetVerified) {
    window.location.replace('forgot-password.html');
} else {
    setupToggles();

    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', (e) => {
            checkPasswordRequirements(e.target.value);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = newPasswordInput.value;
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
            const response = await fetch(`${API_CONFIG.AUTH_API}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccessPopup();

                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetVerified');

                const okBtn = document.getElementById('popupOkBtn');
                if (okBtn) {
                    okBtn.onclick = function () {
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
            errorDisplay.innerText = 'Connection Failed! Please try again';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Reset Password';
        }
    });
}
