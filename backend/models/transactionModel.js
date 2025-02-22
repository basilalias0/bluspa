const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
        stripeChargeId: String,
        stripeCustomerId: String,
        stripePaymentIntentId: String,
        stripeSessionId: String,
        relatedDocument: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'relatedDocumentModel',
        },
        relatedDocumentModel: {
            type: String,
            enum: ['Booking', 'Order'], // Add more as needed
        },
        paymentMethod: String,
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;