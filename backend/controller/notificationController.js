const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const Customer = require('../models/customerModel');
const asyncHandler = require('express-async-handler');
const transporter = require('../utils/mailTransporter'); // Your email transporter

const notificationController = {
    createNotification: asyncHandler(async (req, res) => {
        try {
            const { user, customer, store, message, type, relatedDocument, relatedDocumentModel, data } = req.body;

            if (!message || !type) {
                return res.status(400).json({ message: 'Message and type are required' });
            }

            const notification = await Notification.create({
                user,
                customer,
                store,
                message,
                type,
                relatedDocument,
                relatedDocumentModel,
                data,
            });

            // Send email notification
            await sendEmailNotification(notification);

            res.status(201).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    getNotificationsByUser: asyncHandler(async (req, res) => {
        try {
            const userId = req.user.id; // Assuming req.user is set by your auth middleware
            const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    getNotificationsByCustomer: asyncHandler(async (req, res) => {
        try {
            const customerId = req.user.customer.id; // Assuming req.user is set by your customer auth middleware
            const notifications = await Notification.find({ customer: customerId }).sort({ createdAt: -1 });
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    markNotificationAsRead: asyncHandler(async (req, res) => {
        try {
            const { notificationId } = req.body;
            const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
            if (!updatedNotification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(updatedNotification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    deleteNotification: asyncHandler(async (req, res) => {
        try {
            const { notificationId } = req.body;
            const deletedNotification = await Notification.findByIdAndDelete(notificationId);
            if (!deletedNotification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),
};

async function sendEmailNotification(notification) {
    try {
        let recipientEmail;
        let recipientName;

        if (notification.user) {
            const user = await User.findById(notification.user);
            if (user) {
                recipientEmail = user.email;
                recipientName = user.name;
            }
        } else if (notification.customer) {
            const customer = await Customer.findById(notification.customer);
            if (customer) {
                recipientEmail = customer.email;
                recipientName = customer.firstName + " " + customer.lastName;
            }
        }

        if (recipientEmail) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recipientEmail,
                subject: `New Notification: ${notification.type}`,
                html: `<p>Dear ${recipientName},</p><p>${notification.message}</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

module.exports = notificationController;