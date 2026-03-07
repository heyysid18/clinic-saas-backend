const Patient = require('../models/Patient');
const asyncHandler = require('../middleware/asyncHandler');
const ResponseUtil = require('../utils/response');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new patient
// @route   POST /api/v1/patients
// @access  Private (Requires JWT)
const createPatient = asyncHandler(async (req, res, next) => {
    // Inject the clinicId from the currently authenticated user
    req.body.clinicId = req.user.clinicId;

    const patient = await Patient.create(req.body);

    return ResponseUtil.success(res, patient, 'Patient created successfully', 201);
});

// @desc    Get all patients for the logged-in user's clinic
// @route   GET /api/v1/patients
// @access  Private (Requires JWT)
const getPatients = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, search } = req.query;

    // Base query: strict multi-tenant isolation!
    const query = { clinicId: req.user.clinicId };

    // Implement search on name or phone if provided
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
        ];
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const total = await Patient.countDocuments(query);

    const patients = await Patient.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(parseInt(limit, 10));

    // Pagination result object
    const pagination = {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
    };

    return ResponseUtil.success(res, { count: patients.length, pagination, patients }, 'Patients retrieved', 200);
});

// @desc    Get a single patient
// @route   GET /api/v1/patients/:id
// @access  Private (Requires JWT)
const getPatient = asyncHandler(async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        throw new ErrorResponse('Patient not found', 404);
    }

    // Enforce Tenant Isolation: Ensure patient belongs to user's clinic
    if (patient.clinicId.toString() !== req.user.clinicId.toString()) {
        throw new ErrorResponse('Not authorized to access this patient', 401);
    }

    return ResponseUtil.success(res, patient, 'Patient retrieved', 200);
});

// @desc    Delete a patient
// @route   DELETE /api/v1/patients/:id
// @access  Private (Requires JWT)
const deletePatient = asyncHandler(async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        throw new ErrorResponse('Patient not found', 404);
    }

    // Enforce Tenant Isolation: Ensure patient belongs to user's clinic
    if (patient.clinicId.toString() !== req.user.clinicId.toString()) {
        throw new ErrorResponse('Not authorized to access this patient', 401);
    }

    await patient.deleteOne();

    return ResponseUtil.success(res, {}, 'Patient deleted successfully', 200);
});

module.exports = {
    createPatient,
    getPatients,
    getPatient,
    deletePatient,
};
