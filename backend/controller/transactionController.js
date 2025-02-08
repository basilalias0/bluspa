const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');


const transactionController = {
  getTransactions: asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }); // Get transactions for the logged-in user
    res.json(transactions);
  }),

}

module.exports= transactionController