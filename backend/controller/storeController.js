const asyncHandler = require('express-async-handler');
const Store = require('../models/storeModel');
const mongoose = require('mongoose');

const storeController = {
    getStores: asyncHandler(async (req, res) => {
        try {
            const stores = await Store.find();
            res.json(stores);
        } catch (error) {
            console.error('Error in getStores:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    getStoreById: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid store ID' });
            }
            const store = await Store.findById(req.params.id);
            if (!store) {
                return res.status(404).json({ message: 'Store not found' });
            }
            res.json(store);
        } catch (error) {
            console.error('Error in getStoreById:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    createStore: asyncHandler(async (req, res) => {
        try {
            const { name, address, openingHours, email, phone, location, image, status } = req.body;

            if (!name || !address || !email || !phone) {
                return res.status(400).json({ message: 'Please provide all required fields' });
            }

            const store = await Store.create({
                name,
                address,
                openingHours,
                email,
                phone,
                location,
                image,
                status,
            });

            res.status(201).json(store);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            console.error('Error in createStore:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    updateStore: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid store ID' });
            }
            const storeId = req.params.id;
            const { name, address, openingHours, email, phone, location, image, status } = req.body;

            const updatedStore = await Store.findByIdAndUpdate(
                storeId,
                { name, address, openingHours, email, phone, location, image, status },
                { new: true, runValidators: true }
            );

            if (!updatedStore) {
                return res.status(404).json({ message: 'Store not found' });
            }

            res.json(updatedStore);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            console.error('Error in updateStore:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    updateOpeningHours: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid store ID' });
            }
            const storeId = req.params.id;
            const { day, open, close } = req.body;

            if (!day || !open || !close) {
                return res.status(400).json({ message: 'Day, open, and close times are required' });
            }

            const updatedStore = await Store.findByIdAndUpdate(
                storeId,
                { $set: { 'openingHours.$[elem].open': open, 'openingHours.$[elem].close': close } },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [{ 'elem.day': day }],
                }
            );

            if (!updatedStore) {
                return res.status(404).json({ message: 'Store not found' });
            }

            res.json(updatedStore);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            console.error('Error in updateOpeningHours:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    deleteStore: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid store ID' });
            }
            const deletedStore = await Store.findByIdAndDelete(req.params.id);

            if (!deletedStore) {
                return res.status(404).json({ message: 'Store not found' });
            }

            res.status(204).end();
        } catch (error) {
            console.error('Error in deleteStore:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
};

module.exports = storeController;