const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const isAuth = asyncHandler(async (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // const token = authHeader.split(' ')[1]; // Extract the token (after "Bearer ")
    const token = req.cookies.token;
    if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Store decoded payload in req.user
    next();
});

module.exports = isAuth;