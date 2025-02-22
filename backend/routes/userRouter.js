const express = require('express');
const userController = require('../controller/userController');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const userRouter = express.Router();

// Public Routes (No Authentication Required)
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.loginUser);

// Protected Routes (Authentication Required)
userRouter.post('/logout', isAuth, userController.logoutUser);
userRouter.put('/change-password', isAuth, userController.changePassword);
userRouter.put('/change-role', isAuth, authorize('Admin'), userController.changeRole);
userRouter.put('/reassign-store', isAuth, authorize('Admin', 'Manager'), userController.reassignUserToStore);
userRouter.put('/profile', isAuth, userController.updateUserProfile);
userRouter.put('/status', isAuth, authorize('Admin'), userController.updateUserStatus);

// Protected Routes (Admin Only)
userRouter.get('/', isAuth, authorize('Admin'), userController.getAllUsers);
userRouter.get('/:id', isAuth, authorize('Admin'), userController.getUserById);
userRouter.delete('/:id', isAuth, authorize('Admin'), userController.deleteUser);

module.exports = userRouter;