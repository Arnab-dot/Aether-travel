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
 * Validates and sanitizes form inputs
 * Passwords are NOT sanitized to preserve special characters
 */
export const validateAndSanitize = (data) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (key === 'password') {
            // Don't sanitize passwords - they need special characters
            sanitized[key] = value;
        } else if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value.trim());
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
