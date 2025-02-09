const asyncHandler = require('express-async-handler');
const Store = require('../models/storeModel');


const storeController = {
  getStores: asyncHandler(async (req, res) => {
    const stores = await Store.find();
    res.json(stores);
  }),

  getStoreById: asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }

    res.json(store);
  }),

  createStore: asyncHandler(async (req, res) => {
    const { name, address, openingHours, email, phone } = req.body;

    if (!name || !address || !email || !phone) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const store = await Store.create({
      name,
      address,
      openingHours,
      email,
      phone,
    });

    res.status(201).json(store);
  }),

  updateStore:  asyncHandler(async (req, res) => {
    const storeId = req.params.id;
    const { field, value } = req.body; // Get the field to update and its new value
  
    if (!field || !value) {
      res.status(400);
      throw new Error('Field and value are required');
    }
  
    // 1. Validate the field (optional but recommended)
    const allowedFields = ['name', 'address', 'email', 'phone']; // Add other fields as needed
    if (!allowedFields.includes(field)) {
      res.status(400);
      throw new Error('Invalid field');
    }
      const updatedStore = await Store.findByIdAndUpdate(
        storeId,
        { [field]: value }, // Use bracket notation to dynamically update the field
        { new: true, runValidators: true }
      );
  
      if (!updatedStore) {
        res.status(404);
        throw new Error('Store not found');
      }
  
      res.json(updatedStore);
    
  }),

  updateOpeningHours:asyncHandler(async (req, res) => {
    const storeId = req.params.id;
    const { day, time, action } = req.body;
  
    if (!day || !time || !action || (action !== 'add' && action !== 'remove')) {
      res.status(400);
      throw new Error('Day, time, and action ("add" or "remove") are required');
    }
      let updatedStore;
  
      if (action === 'add') {
        updatedStore = await Store.findByIdAndUpdate(
          storeId,
          { $addToSet: { [`openingHours.${day}`]: time } }, // Use $addToSet to prevent duplicates
          { new: true, runValidators: true }
        );
      } else if (action === 'remove') {
        updatedStore = await Store.findByIdAndUpdate(
          storeId,
          { $pull: { [`openingHours.${day}`]: time } }, // Use $pull to remove the time
          { new: true, runValidators: true }
        );
      }
  
      if (!updatedStore) {
        res.status(404);
        throw new Error('Store not found');
      }
  
      res.json(updatedStore)
      
    }),

  deleteStore: asyncHandler(async (req, res) => {
    const deletedStore = await Store.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

    if (!deletedStore) {
      res.status(404);
      throw new Error('Store not found');
    }

    res.status(204).end(); // 204 No Content
  }),
};

module.exports = storeController;