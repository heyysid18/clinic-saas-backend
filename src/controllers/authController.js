const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const ResponseUtil = require('../utils/response');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register a new clinic and admin user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
    const { clinicName, clinicAddress, userName, email, password, role } = req.body;

    // Basic validation
    if (!clinicName || !clinicAddress || !userName || !email || !password) {
        throw new ErrorResponse('Please provide all required fields (clinicName, clinicAddress, userName, email, password)', 400);
    }

    const userData = await authService.registerUser(
        clinicName,
        clinicAddress,
        userName,
        email,
        password,
        role
    );

    return ResponseUtil.success(res, userData, 'Clinic and User registered successfully', 201);
});

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ErrorResponse('Please provide an email and password', 400);
    }

    const userData = await authService.loginUser(email, password);

    return ResponseUtil.success(res, userData, 'User logged in successfully', 200);
});

module.exports = {
    register,
    login,
};
