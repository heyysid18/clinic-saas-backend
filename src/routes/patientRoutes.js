const express = require('express');
const {
    createPatientValidation,
} = require('../validators/patientValidator');
const validate = require('../middleware/validate');
const {
    createPatient,
    getPatients,
    getPatient,
    deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect ALL patient routes with JWT
router.use(protect);

router
    .route('/')
    .post(createPatientValidation, validate, createPatient) // Add express-validator middleware here
    .get(getPatients);

router
    .route('/:id')
    .get(getPatient)
    .delete(deletePatient);

module.exports = router;
