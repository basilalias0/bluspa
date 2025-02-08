const express = require('express');
const transactionController = require('../controller/transactionController');
const isAuth = require('../middlewares/isAuth');
const transactionRouter = express.Router();


transactionRouter.get('/', isAuth, transactionController.getTransactions);

module.exports = transactionRouter