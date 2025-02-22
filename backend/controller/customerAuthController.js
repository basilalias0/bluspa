const Customer = require('../models/customerModel');
const CustomerAuth = require('../models/customerAuthModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


CustomerAuth
const customerAuthController = {
    registerCustomerAuth: asyncHandler(async (req, res) => {
        try {
            const { email, password, customerId } = req.body;

            if (!email || !password || !customerId) {
                return res.status(400).json({ message: 'Email, password, and customerId are required' });
            }

            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                return res.status(400).json({ message: 'Invalid customerId' });
            }

            const customerExists = await Customer.findById(customerId);
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            const authExists = await CustomerAuth.findOne({ email });
            if (authExists) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const customerAuth = await CustomerAuth.create({
                email,
                password: hashedPassword,
                customerId,
            });

            res.status(201).json(customerAuth);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    loginCustomerAuth: asyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const customerAuth = await CustomerAuth.findOne({ email }).populate('customerId');

            if (!customerAuth || !(await bcrypt.compare(password, customerAuth.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                customerId: customerAuth.customerId._id,
                email: customerAuth.email,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

            res.cookie('customerToken', token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });

            res.json({
                customerId: customerAuth.customerId._id,
                email: customerAuth.email,
                token,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    logoutCustomerAuth: asyncHandler(async (req, res) => {
        res.clearCookie('customerToken');
        res.json({ message: 'Logged out successfully' });
    }),

    changePasswordCustomerAuth: asyncHandler(async (req, res) => {
        try{
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Current password and new password are required' });
            }

            const customerAuth = await CustomerAuth.findOne({ email: req.user.email });
            if (!customerAuth) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, customerAuth.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            customerAuth.password = hashedPassword;
            await customerAuth.save();

            res.json({ message: 'Password updated successfully' });
        } catch(error) {
            res.status(500).json({ message: error.message });
        }
    })
};

module.exports = customerAuthController;