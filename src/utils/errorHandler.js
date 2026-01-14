/**
 * Sanitizes error messages for user display
 * Prevents exposure of sensitive technical details in production
 */
export const getUserFriendlyError = (error, defaultMessage = 'An error occurred') => {
    // Don't expose technical details in production
    if (import.meta.env.PROD) {
        return defaultMessage;
    }

    // In development, show more details for debugging
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return defaultMessage;
};

/**
 * Formats API error responses for user display
 */
export const formatApiError = (response, data) => {
    if (!response.ok) {
        // Check for specific error messages from backend
        if (data?.message) {
            return data.message;
        }

        if (data?.error) {
            return data.error;
        }

        // Generic error based on status code
        switch (response.status) {
            case 400:
                return 'Invalid request. Please check your input.';
            case 401:
                return 'Authentication failed. Please check your credentials.';
            case 403:
                return 'Access denied.';
            case 404:
                return 'Resource not found.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    return null;
};
