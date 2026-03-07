const config = require('../config');
const ResponseUtil = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Default to 500 server error if status code not set
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let errorsPayload = null;

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        error.message = 'Resource not found';
        statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map((val) => val.message).join(', ');
        statusCode = 400;
        errorsPayload = Object.values(err.errors).map(v => v.message);
    }

    // Log to console for dev, except for standard 404s/401s
    if (config.env === 'development') {
        if (statusCode !== 404 && statusCode !== 401) {
            console.error(err.stack);
        } else {
            console.error(`Route Error: ${error.message}`);
        }
    }

    return ResponseUtil.error(
        res,
        error.message || 'Server Error',
        statusCode,
        errorsPayload
    );
};

module.exports = errorHandler;
