const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a clinic name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Clinic', clinicSchema);
