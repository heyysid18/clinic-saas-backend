const Patient = require('../models/Patient');
const asyncHandler = require('../middleware/asyncHandler');
const ResponseUtil = require('../utils/response');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard
// @access  Private (Requires JWT)
const getDashboardStats = asyncHandler(async (req, res, next) => {
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

    return ResponseUtil.success(res, formattedStats, 'Dashboard stats retrieved', 200);
});

module.exports = {
    getDashboardStats,
};
