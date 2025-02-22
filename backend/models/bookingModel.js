const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service', // Assuming you have a Service model
        required: true,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming employees are Users
        required: true,
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String, // e.g., '10:00 AM'
        required: true,
    },
    endTime: {
        type: String, // e.g., '11:00 AM'
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled', 'completed'],
        default: 'pending',
    },
    notes: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;