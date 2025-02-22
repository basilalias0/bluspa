const express = require('express');
const customerController = require('../controller/customerController');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const customerRouter = express.Router();

// Routes for Customer Controller

// Public route to create a new customer
customerRouter.post('/', customerController.createCustomer);

// Protected routes (Admin, Manager, Employee)
customerRouter.get('/', isAuth, authorize('Admin', 'Manager', 'Employee'), customerController.getAllCustomers);
customerRouter.get('/:id', isAuth, authorize('Admin', 'Manager', 'Employee'), customerController.getCustomerById);
customerRouter.put('/:id', isAuth, authorize('Admin', 'Manager', 'Employee'), customerController.updateCustomer);
customerRouter.put('/:id/marketing-agreement', isAuth, authorize('Admin', 'Manager', 'Employee'), customerController.updateMarketingAgreement);
customerRouter.delete('/:id', isAuth, authorize('Admin'), customerController.deleteCustomer); // Only admins can delete

module.exports = customerRouter;