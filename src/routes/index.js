const express = require('express');
const exampleRoutes = require('./exampleRoutes');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Mount all v1 routes here
router.use('/example', exampleRoutes);
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
