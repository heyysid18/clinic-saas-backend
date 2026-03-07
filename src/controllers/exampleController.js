// @desc    Get example data
// @route   GET /api/v1/example
// @access  Public
const getExample = (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Example endpoint reached successfully!',
            data: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExample
};
