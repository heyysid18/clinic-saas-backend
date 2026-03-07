const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const config = require('../config');

// Generate JWT Token
const generateToken = (userId, clinicId) => {
    return jwt.sign({ id: userId, clinicId }, config.jwtSecret, {
        expiresIn: '7d', // Token expiry (7 days) as requested
    });
};

const registerUser = async (clinicName, clinicAddress, userName, email, password, role) => {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    // 2. Create clinic
    const clinic = await Clinic.create({
        name: clinicName,
        address: clinicAddress,
    });

    // 3. Create user linked to clinic
    const user = await User.create({
        name: userName,
        email,
        password,
        role: role || 'admin', // First user might be admin typically, or based on input
        clinicId: clinic._id,
    });

    // 4. Generate Token
    const token = generateToken(user._id, clinic._id);

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: clinic._id,
        token,
    };
};

const loginUser = async (email, password) => {
    // 1. Check for user email and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 2. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 3. Generate token
    const token = generateToken(user._id, user.clinicId);

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        token,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
