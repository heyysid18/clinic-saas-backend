const { validationResult } = require('express-validator');
const ResponseUtil = require('../utils/response');

// Reusable validation middleware executor
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseUtil.error(res, 'Validation Error', 400, errors.array());
    }
    next();
};

module.exports = validate;
