const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

const notificationController = {
  getNotifications: asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }); // Get notifications for the logged-in user, sorted by recent
    res.json(notifications);
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    res.json(notification);
  }),

  deleteNotification: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    res.status(204).end(); // 204 No Content for successful delete
  }),
};

module.exports = notificationController;