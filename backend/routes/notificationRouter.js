const express = require('express');
const notificaionRouter = express.Router();
const isAuth = require('../middlewares/isAuth');
const notificationController = require('../controller/notificationController');

notificaionRouter.get('/', isAuth, notificationController.getNotifications);
// notificaionRouter.post('/', isAuth, notificationController.createNotification)
notificaionRouter.put('/:id', isAuth, notificationController.markAsRead);
notificaionRouter.delete('/:id', isAuth, notificationController.deleteNotification);

module.exports = notificaionRouter