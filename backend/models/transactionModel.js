const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: { // e.g., 'deposit', 'withdrawal', 'purchase'
      type: String,
      required: true,
    },
    status: { // e.g., 'pending', 'completed', 'failed'
      type: String,
      default: 'pending',
    },
    // Add other relevant transaction fields (e.g., product, order, date)
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;