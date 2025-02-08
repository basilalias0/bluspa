const express = require('express');
const customerController = require('../controller/customerController');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const customerRouter = express.Router();

// Routes for Customer Controller

customerRouter.get('/',isAuth,authorize("Admin","Manager","Employee"), customerController.getAllCustomers); // Get all customers (with optional query params for search, filter, sort)
customerRouter.get('/:id',isAuth,authorize("Admin","Manager","Employee"),customerController.getCustomerById); // Get customer by ID
customerRouter.post('/', customerController.registerCustomer); // Create a new customer
customerRouter.put('/update-password',isAuth,customerController.updatePassword); // Update pssword
customerRouter.put('/update-email',isAuth, customerController.updateEmail); // Update emaiil
customerRouter.put('/update-name',isAuth, customerController.updateName); // Update name
customerRouter.put('/update-phone',isAuth, customerController.updatePhone); // Update phone number
customerRouter.delete('/:id',isAuth, customerController.deleteCustomer); // Delete a customer

module.exports = customerRouter;