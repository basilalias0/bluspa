const express = require('express');
const customerAuthController = require('../controller/customerAuthController');
const isAuthCustomer = require('../middlewares/isAuthCustomer');
const customerAuthRouter = express.Router();

customerAuthRouter.post('/register', customerAuthController.registerCustomerAuth);
customerAuthRouter.post('/login', customerAuthController.loginCustomerAuth);
customerAuthRouter.post('/logout', customerAuthController.logoutCustomerAuth);
customerAuthRouter.put('/change-password', isAuthCustomer, customerAuthController.changePasswordCustomerAuth);

module.exports = customerAuthRouter;