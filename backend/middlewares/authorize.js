const asyncHandler = require('express-async-handler');

const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Not authorized. Insufficient privileges.");
    }
    next();
  });
};

module.exports = authorize