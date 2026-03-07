/**
 * Async Handler to wrap controllers and eliminate try...catch blocks.
 * Passes any caught errors directly to the Express next() function.
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
