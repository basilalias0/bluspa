const Customer = require("../models/customerModel");
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const customerController = {
    getAllCustomers: asyncHandler(async (req, res) => {
        try {
            const { search, firstName, lastName, email, phone, sortBy, sortOrder, marketingAgreement } = req.query;
            const query = {};

            if (search) {
                const searchTerm = new RegExp(search, 'i');
                query.$or = [
                    { firstName: searchTerm },
                    { lastName: searchTerm },
                    { email: searchTerm },
                    { phone: searchTerm },
                ];
            } else {
                if (firstName) query.firstName = new RegExp(firstName, 'i');
                if (lastName) query.lastName = new RegExp(lastName, 'i');
                if (email) query.email = new RegExp(email, 'i');
                if (phone) query.phone = new RegExp(phone, 'i');
                if (marketingAgreement !== undefined) {
                    query.marketingAgreement = marketingAgreement === 'true';
                }
            }

            const sort = {};
            if (sortBy) {
                sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            }

            const customers = await Customer.find(query).sort(sort);
            res.json(customers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    getCustomerById: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid customer ID' });
            }
            const customer = await Customer.findById(req.params.id).populate('bookings');
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json(customer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    createCustomer: asyncHandler(async (req, res) => {
        try {
            const { firstName, lastName, email, phone, marketingAgreement, customerNotes } = req.body;
            const customer = await Customer.create({ firstName, lastName, email, phone, marketingAgreement, customerNotes });
            res.status(201).json(customer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }),

    updateMarketingAgreement: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid customer ID' });
            }
            const { marketingAgreement } = req.body;
            const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
                marketingAgreement,
                marketingAgreementDate: marketingAgreement ? new Date() : null
            }, { new: true, runValidators: true });
            if (!updatedCustomer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json(updatedCustomer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    updateCustomer: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid customer ID' });
            }
            const { firstName, lastName, email, phone, marketingAgreement, customerNotes } = req.body;
            const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
                firstName, lastName, email, phone, marketingAgreement, customerNotes
            }, { new: true, runValidators: true });
            if (!updatedCustomer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json(updatedCustomer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }),

    deleteCustomer: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid customer ID' });
            }
            const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
            if (!deletedCustomer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),
};

module.exports = customerController;