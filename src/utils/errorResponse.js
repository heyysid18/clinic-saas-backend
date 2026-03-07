/**
 * Enhanced Error Class with automatic Status Code mapping
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ErrorResponse;
