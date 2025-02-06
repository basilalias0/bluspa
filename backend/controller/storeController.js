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

  updateStore: asyncHandler(async (req, res) => {
    const { name, address, openingHours, email, phone } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { name, address, openingHours, email, phone },
      { new: true, runValidators: true }
    );

    res.json(updatedStore);
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