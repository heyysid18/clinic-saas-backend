const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a patient name'],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Please add patient age'],
            min: [0, 'Age must be a positive number'],
        },
        gender: {
            type: String,
            required: [true, 'Please specify patient gender'],
            enum: {
                values: ['male', 'female', 'other'],
                message: '{VALUE} is not a valid gender',
            },
        },
        phone: {
            type: String,
            required: [true, 'Please add a contact phone number'],
        },
        testType: {
            type: String,
            required: [true, 'Please specify the test type'],
            trim: true,
        },
        reportStatus: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clinic',
            required: [true, 'Patient must belong to a clinic'],
            index: true, // Crucial for multi-tenant query performance
        },
    },
    {
        timestamps: true,
    }
);

// Create compound index if needed for searching patients within a clinic by name/phone
patientSchema.index({ clinicId: 1, name: 1 });
patientSchema.index({ clinicId: 1, phone: 1 });

module.exports = mongoose.model('Patient', patientSchema);
