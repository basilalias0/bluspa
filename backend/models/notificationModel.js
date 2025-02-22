const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        store: {
            type: Schema.Types.ObjectId,
            ref: 'Store',
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedDocument: {
            type: Schema.Types.ObjectId,
            refPath: 'relatedDocumentModel',
        },
        relatedDocumentModel: {
            type: String,
            enum: ['Booking', 'Payment', 'Inventory', 'Customer'], // Add more as needed
        },
        data: {
            type: Schema.Types.Mixed, // Allows for any data type
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;