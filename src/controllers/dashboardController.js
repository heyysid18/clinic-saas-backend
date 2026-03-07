const Patient = require('../models/Patient');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard
// @access  Private (Requires JWT)
const getDashboardStats = async (req, res, next) => {
    try {
        const clinicId = req.user.clinicId;

        // Calculate start of today for 'testsToday' calculation
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Optimized MongoDB Aggregation Pipeline
        const stats = await Patient.aggregate([
            // 1. Filter entirely by the current clinic (Tenant Isolation)
            { $match: { clinicId: clinicId } },
            // 2. Facet to run multiple aggregation pipelines in parallel within a single query
            {
                $facet: {
                    totalPatients: [{ $count: 'count' }],
                    testsToday: [
                        { $match: { createdAt: { $gte: startOfToday } } },
                        { $count: 'count' },
                    ],
                    pendingReports: [
                        { $match: { reportStatus: 'pending' } },
                        { $count: 'count' },
                    ],
                },
            },
        ]);

        // Format output easily since $facet returns arrays
        const formattedStats = {
            totalPatients: stats[0].totalPatients[0]?.count || 0,
            testsToday: stats[0].testsToday[0]?.count || 0,
            pendingReports: stats[0].pendingReports[0]?.count || 0,
        };

        res.status(200).json({
            success: true,
            data: formattedStats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
};
