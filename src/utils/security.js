// Security utilities for the Aether Travel application

/**
 * Validates that the API URL uses HTTPS in production
 */
export const validateSecureConnection = (apiUrl) => {
    if (import.meta.env.PROD && !apiUrl.startsWith('https://')) {
        console.error('⚠️ SECURITY WARNING: API URL must use HTTPS in production!');
        throw new Error('Insecure API connection detected. HTTPS is required.');
    }
};

/**
 * Creates secure headers for API requests
 */
export const getSecureHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validates password strength
 */
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak'
    };
};

/**
 * Securely clears sensitive data from memory
 */
export const clearSensitiveData = (obj) => {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
                obj[key] = null;
            }
        });
    }
};

/**
 * Rate limiting helper for preventing brute force attacks
 */
class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        this.attempts = new Map();
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    isAllowed(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];

        // Remove old attempts outside the time window
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(identifier, recentAttempts);
        return true;
    }

    reset(identifier) {
        this.attempts.delete(identifier);
    }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
