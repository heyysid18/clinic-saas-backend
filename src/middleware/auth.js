const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Protect routes - Verify JWT Token
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Decode token to get user ID and clinic ID
            const decoded = jwt.verify(token, config.jwtSecret);

            // Find user and attach to req object (excluding password)
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token present'));
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(
                new Error(`User role '${req.user ? req.user.role : 'None'}' is not authorized to access this route`)
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
