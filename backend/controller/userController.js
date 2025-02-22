const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
require('dotenv').config();
const crypto = require('crypto');
const transporter = require('../utils/mailTransporter');
const Store = require('../models/storeModel');
const mongoose = require('mongoose');

const userController = {
    register: asyncHandler(async (req, res) => {
        try {
            const { name, email, role, store } = req.body;

            if (!name || !email || !role) {
                return res.status(400).json({ message: 'Data incomplete!' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists!' });
            }

            const password = crypto.randomBytes(16).toString('hex');

            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) {
                return res.status(500).json({ message: 'Password hashing failed!' });
            }

            const createdUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                store,
            });

            if (!createdUser) {
                return res.status(500).json({ message: 'User creation failed.' });
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome!',
                html: `<p>Dear ${name},</p><p>Welcome to our platform! Your temporary password is: <strong>${password}</strong></p><p>Please change your password after logging in for the first time.</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            res.status(201).json({
                name,
                email,
                id: createdUser._id,
                role: createdUser.role,
                store: createdUser.store,
                message: 'User created successfully. Temporary password sent to email.',
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    loginUser: asyncHandler(async (req, res) => {
      try {
          const { email, password } = req.body;

          if (!email || !password) {
              return res.status(400).json({ message: 'Data incomplete!' });
          }

          const userFound = await User.findOne({ email });
          if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
              return res.status(401).json({ message: 'Invalid credentials' });
          }

          // Update last login
          userFound.lastLogin = new Date();
          await userFound.save();

          const payload = {
              username: userFound.username,
              id: userFound._id,
              role: userFound.role,
          };

          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

          res.cookie('token', token, {
              maxAge: 1 * 24 * 60 * 60 * 1000,
              sameSite: 'strict',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
          });

          res.json({
              name: userFound.name,
              email: userFound.email,
              username: userFound.username,
              id: userFound._id,
              role: userFound.role,
              profileImage: userFound.profileImage,
              token,
          });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

    reassignUserToStore: asyncHandler(async (req, res) => {
        try {
            const { employeeId, newStoreId } = req.body;

            if (!employeeId || !newStoreId) {
                return res.status(400).json({ message: 'Employee ID and new store ID are required' });
            }

            if (!mongoose.Types.ObjectId.isValid(employeeId) || !mongoose.Types.ObjectId.isValid(newStoreId)) {
                return res.status(400).json({ message: 'Invalid employee or store ID' });
            }

            const employee = await User.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            const store = await Store.findById(newStoreId);
            if (!store) {
                return res.status(404).json({ message: 'Store not found' });
            }

            const updatedUser = await User.findByIdAndUpdate(employeeId, { store: newStoreId }, { new: true, runValidators: true }).populate('store');

            if (!updatedUser) {
                return res.status(500).json({ message: 'Employee not updated' });
            }

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    changePassword: asyncHandler(async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Current password and new password are required' });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),
    changeRole: asyncHandler(async (req, res) => {
      try {
          const { userId, newRole } = req.body;

          if (!userId || !newRole) {
              return res.status(400).json({ message: 'User ID and new role are required' });
          }

          if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ message: 'Invalid user ID' });
          }

          if (!['Admin', 'Manager', 'Employee'].includes(newRole)) {
              return res.status(400).json({ message: 'Invalid role' });
          }

          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          user.role = newRole;
          await user.save();

          res.json({ message: 'Role updated successfully', user });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

    logoutUser: asyncHandler(async (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    }),
    getUserById: asyncHandler(async (req, res) => {
      try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
              return res.status(400).json({ message: 'Invalid user ID' });
          }
          const user = await User.findById(req.params.id);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

  getAllUsers: asyncHandler(async (req, res) => {
      try {
          const users = await User.find();
          res.json(users);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

  updateUserProfile: asyncHandler(async (req, res) => {
      try {
          const { name, profileImage } = req.body;
          const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, profileImage }, { new: true, runValidators: true });
          if (!updatedUser) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.json(updatedUser);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

  deleteUser: asyncHandler(async (req, res) => {
      try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
              return res.status(400).json({ message: 'Invalid user ID' });
          }
          const deletedUser = await User.findByIdAndDelete(req.params.id);
          if (!deletedUser) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(204).end();
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
      try {
          const { userId, status } = req.body;

          if (!userId || !['active', 'inactive', 'blocked'].includes(status)) {
              return res.status(400).json({ message: 'User ID and valid status are required' });
          }

          if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ message: 'Invalid user ID' });
          }

          const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true, runValidators: true });
          if (!updatedUser) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.json(updatedUser);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }),
};

module.exports = userController;