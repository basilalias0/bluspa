const express = require('express');
const notificationController = require('../controller/notificationController');
const isAuth = require('../middlewares/isAuth');
const isAuthCustomer = require('../middlewares/isAuthCustomer');
const authorize = require('../middlewares/authorize');
const notificationRouter = express.Router();

// Protected Routes (Admin/Manager/Employee - User Notifications)
notificationRouter.post('/', isAuth, authorize('Admin', 'Manager', 'Employee'), notificationController.createNotification);
notificationRouter.get('/user', isAuth, notificationController.getNotificationsByUser);
notificationRouter.put('/read', isAuth, notificationController.markNotificationAsRead);
notificationRouter.delete('/', isAuth, authorize('Admin', 'Manager', 'Employee'), notificationController.deleteNotification);

// Protected Routes (Customer Notifications)
notificationRouter.get('/customer', isAuthCustomer, notificationController.getNotificationsByCustomer);

module.exports = notificationRouter;