const express = require('express');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const storeRouter = express.Router();
const storeController = require('../controller/storeController');

// Public Routes (accessible without authentication)
storeRouter.get('/', storeController.getStores);
storeRouter.get('/:id', storeController.getStoreById);

// Protected Routes (require authentication)
storeRouter.post('/', isAuth, authorize('Admin'), storeController.createStore); // Only Admin
storeRouter.put('/:id', isAuth, authorize('Admin', 'Manager'), storeController.updateStore); // Only Admin or Manager
storeRouter.put('/:id/opening-hours', isAuth, authorize('Admin', 'Manager'), storeController.updateOpeningHours); // Only Admin or Manager
storeRouter.delete('/:id', isAuth, authorize('Admin'), storeController.deleteStore); // Only Admin

module.exports = storeRouter;