const express = require('express');
const transactionController = require('../controller/transactionController');
const isAuth = require('../middlewares/isAuth');
const isAuthCustomer = require('../middlewares/isAuthCustomer');
const transactionRouter = express.Router();

// Stripe Webhook Route (Public)
transactionRouter.post('/webhook', express.raw({ type: 'application/json' }), transactionController.handleStripeWebhook);

// Protected Routes (User - Admin/Manager/Employee)
transactionRouter.get('/user', isAuth, transactionController.getTransactionsByUser);
transactionRouter.get('/:id', isAuth, transactionController.getTransactionById);

// Protected Routes (Customer)
transactionRouter.get('/customer', isAuthCustomer, transactionController.getTransactionsByCustomer);

module.exports = transactionRouter;