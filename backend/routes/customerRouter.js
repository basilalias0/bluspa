const express = require('express');
const customerController = require('../controller/customerController');
const customerRouter = express.Router();

// Routes for Customer Controller

customerRouter.get('/', customerController.getAllCustomers); // Get all customers (with optional query params for search, filter, sort)
customerRouter.get('/:id', customerController.getCustomerById); // Get customer by ID
customerRouter.post('/', customerController.createCustomer); // Create a new customer
customerRouter.put('/:id', customerController.updateCustomer); // Update a customer
customerRouter.delete('/:id', customerController.deleteCustomer); // Delete a customer

module.exports = customerRouter;