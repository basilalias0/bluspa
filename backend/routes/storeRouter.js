const express = require('express');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const storeRouter = express.Router();


// Public Routes (accessible without authentication)
storeRouter.get('/', storeController.getStores);
storeRouter.get('/:id', storeController.getStoreById);

// Protected Routes (require authentication)
storeRouter.post('/', isAuth, authorize('Admin', 'Manager'), storeController.createStore); // Only Admin or Manager
storeRouter.put('/:id', isAuth, authorize('Admin', 'Manager'), storeController.updateStore); // Only Admin or Manager
storeRouter.delete('/:id', isAuth, authorize('Admin'), storeController.deleteStore); // Only Admin

module.exports = storeRouter;