const authService = require('../services/authService');

// @desc    Register a new clinic and admin user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { clinicName, clinicAddress, userName, email, password, role } = req.body;

        // Basic validation
        if (!clinicName || !clinicAddress || !userName || !email || !password) {
            res.status(400);
            throw new Error('Please provide all required fields (clinicName, clinicAddress, userName, email, password)');
        }

        const userData = await authService.registerUser(
            clinicName,
            clinicAddress,
            userName,
            email,
            password,
            role
        );

        res.status(201).json({
            success: true,
            message: 'Clinic and User registered successfully',
            data: userData,
        });
    } catch (error) {
        // Pass custom status code to error handler if present
        if (error.statusCode) {
            res.status(error.statusCode);
        }
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide an email and password');
        }

        const userData = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: userData,
        });
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode);
        }
        next(error);
    }
};

module.exports = {
    register,
    login,
};
