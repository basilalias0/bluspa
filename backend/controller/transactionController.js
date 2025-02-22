const Transaction = require('../models/transactionModel');
const Booking = require('../models/bookingModel');
const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Assuming you have Stripe secret key in .env
const mongoose = require('mongoose');

const transactionController = {
    // Handle Stripe Webhooks
    handleStripeWebhook: asyncHandler(async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await processPaymentIntentSucceeded(paymentIntent);
                break;
            case 'charge.succeeded':
                const charge = event.data.object;
                await processChargeSucceeded(charge);
                break;
            // Add other webhook event handlers as needed
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }),

    // Get transactions by user
    getTransactionsByUser: asyncHandler(async (req, res) => {
        try {
            const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    // Get transactions by customer
    getTransactionsByCustomer: asyncHandler(async (req, res) => {
        try {
            const transactions = await Transaction.find({ customer: req.user.customer.id }).sort({ createdAt: -1 });
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    // Get transaction by ID
    getTransactionById: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid transaction ID' });
            }
            const transaction = await Transaction.findById(req.params.id);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    // Helper functions for webhook processing
    processPaymentIntentSucceeded: async (paymentIntent) => {
        try {
            const transaction = await Transaction.create({
                amount: paymentIntent.amount / 100, // Stripe amounts are in cents
                type: 'payment_intent',
                status: 'completed',
                stripePaymentIntentId: paymentIntent.id,
                stripeCustomerId: paymentIntent.customer,
                paymentMethod: paymentIntent.payment_method,
                // Add related document logic here if needed, booking or order.
            });
            // Update booking payment status if needed.
            await updateBookingPaymentStatus(paymentIntent.metadata.bookingId, 'paid');
            console.log(`PaymentIntent succeeded for ${paymentIntent.id}`);
        } catch (error) {
            console.error('Error processing PaymentIntent:', error);
        }
    },

    processChargeSucceeded: async (charge) => {
        try {
            const transaction = await Transaction.create({
                amount: charge.amount / 100,
                type: 'charge',
                status: 'completed',
                stripeChargeId: charge.id,
                stripeCustomerId: charge.customer,
                paymentMethod: charge.payment_method,
                // Add related document logic here if needed.
            });
            // Update booking payment status if needed.
            await updateBookingPaymentStatus(charge.metadata.bookingId, 'paid');
            console.log(`Charge succeeded for ${charge.id}`);
        } catch (error) {
            console.error('Error processing Charge:', error);
        }
    },
};

async function updateBookingPaymentStatus(bookingId, status) {
    if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: status });
    }
}

module.exports = transactionController;