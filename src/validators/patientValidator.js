const { check, validationResult } = require('express-validator');

// Validation rules for creating a patient
const createPatientValidation = [
    check('name', 'Name is required').notEmpty(),
    check('age', 'Age must be a positive number').isInt({ min: 0 }),
    check('gender', 'Gender is required and must be valid').isIn(['male', 'female', 'other']),
    check('phone', 'Please include a valid phone number').notEmpty(),
    check('testType', 'Test type is required').notEmpty(),
    check('reportStatus').optional().isIn(['pending', 'completed']),
];

module.exports = {
    createPatientValidation,
};
