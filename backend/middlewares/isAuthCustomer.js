const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const CustomerAuth = require('../models/customerAuthModel');
const Customer = require('../models/customerModel');

const isAuthCustomer = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.customerToken) {
        try {
            token = req.cookies.customerToken;
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Attach customer information to req.user
            const customerAuth = await CustomerAuth.findById(decoded.customerId);

            if (customerAuth) {
                const customer = await Customer.findById(customerAuth.customerId);

                if (customer) {
                    req.user = {
                        customerId: customerAuth.customerId,
                        email: customerAuth.email,
                        customer: customer //Entire customer object accessible in req.user.customer
                    };
                    next();
                } else {
                    res.status(404);
                    throw new Error('Customer not found');
                }
            } else {
                res.status(401);
                throw new Error('Not authorized, token failed: CustomerAuth not found');
            }

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed: ' + error.message);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = isAuthCustomer;