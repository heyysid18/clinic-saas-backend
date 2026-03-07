const Patient = require('../models/Patient');

// @desc    Create new patient
// @route   POST /api/v1/patients
// @access  Private (Requires JWT)
const createPatient = async (req, res, next) => {
    try {
        // Inject the clinicId from the currently authenticated user
        req.body.clinicId = req.user.clinicId;

        const patient = await Patient.create(req.body);

        res.status(201).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all patients for the logged-in user's clinic
// @route   GET /api/v1/patients
// @access  Private (Requires JWT)
const getPatients = async (req, res, next) => {
    try {
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

        res.status(200).json({
            success: true,
            count: patients.length,
            pagination,
            data: patients,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single patient
// @route   GET /api/v1/patients/:id
// @access  Private (Requires JWT)
const getPatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            res.status(404);
            throw new Error('Patient not found');
        }

        // Enforce Tenant Isolation: Ensure patient belongs to user's clinic
        if (patient.clinicId.toString() !== req.user.clinicId.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this patient');
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a patient
// @route   DELETE /api/v1/patients/:id
// @access  Private (Requires JWT)
const deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            res.status(404);
            throw new Error('Patient not found');
        }

        // Enforce Tenant Isolation: Ensure patient belongs to user's clinic
        if (patient.clinicId.toString() !== req.user.clinicId.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this patient');
        }

        await patient.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatient,
    deletePatient,
};
