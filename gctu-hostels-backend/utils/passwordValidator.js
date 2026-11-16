function validatePassword(password) {
    const errors = [];

    if (typeof password !== 'string') {
        return { isValid: false, errors: ['Password must be a string'] };
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
        errors.push('Password must be no more than 72 bytes');
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

module.exports = validatePassword;