const { check } = require('express-validator');

const registerValidation = [
    check('userName', 'User Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('clinicName', 'Clinic name is required').notEmpty(),
    // clinicAddress might optionally be required based on your earlier setup, keeping it flexible
    check('clinicAddress', 'Clinic address is required').notEmpty(),
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

module.exports = {
    registerValidation,
    loginValidation,
};
