const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
require('dotenv').config()
const crypto = require('crypto');
const  transporter  = require('../utils/mailTransporter');
const Store = require('../models/storeModel');


const userController = {
    register: asyncHandler(async (req, res) => {
      const { name, email, role, store } = req.body;
      console.log("Running");
      if (!name || !email || !role) { // Password not required in request body
        return res.status(400).json({ message: "Data incomplete!" });
      }
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists!" });
      }
  
      // 1. Generate random password
      const password = crypto.randomInt(100000, 999999).toString(); // 6-digit random number
  
      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      if(!hashedPassword){
        return res.status(400).json({ message: "Password hashing failed!" });
      }
  
      // 3. Create the user
      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        store,
      });
  
      if (!createdUser) {
        return res.status(500).json({ message: "User creation failed." });
      }
      console.log("Running");
      
  
      // 4. Send email with the generated password
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome!',
        html: `<p>Dear ${name},</p><p>Welcome to our platform! Your temporary password is: <strong>${password}</strong></p><p>Please change your password after logging in for the first time.</p>`, // HTML email
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
  
      res.status(201).json({
        name,
        email,
        id: createdUser._id,
        role: createdUser.role,
        store: createdUser.store,
        message: "User created successfully. Temporary password sent to email." // Include success message
      });
    }),
    loginUser: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if(!email|| !password){
          return res.status(400).json({ message: "Data incomplete!" }); // 400 Bad Request
        }
      
        const userFound = await User.findOne({ email });
      
        if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
          res.status(401); // Set Unauthorized status
          throw new Error("Invalid credentials"); // Throw error for the error handler
        }
        console.log(userFound.role);
        
      
        const payload = { 
          username: userFound.username, 
          id: userFound._id, 
          role: userFound.role 
        }; 
      
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); // shorter way to set expiry
      
        res.cookie('token', token, {
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
          sameSite: 'none', // Or 'strict' if you want to be stricter
          httpOnly: true,
          secure: false, // Set to true if using HTTPS
        });
      
        res.json({
          name: userFound.name,
          email: userFound.email,
          username: userFound.username,
          id: userFound._id,
          role: userFound.role,
          profileImage: userFound.profileImage,
          token
        });
      }),
    reassignUserToStore:asyncHandler(async (req, res) => {
        const { employeeId, newStoreId } = req.body;
      
        if (!employeeId || !newStoreId) {
          res.status(400);
          throw new Error('Employee ID and new store ID are required');
        }
      
        // 1. Check if the employee exists
        const employee = await User.findById(employeeId);
        if (!employee) {
          res.status(404);
          throw new Error('Employee not found');
        }
      
        // 2. Check if the new store exists
        const store = await Store.findById(newStoreId);
        if (!store) {
          res.status(404);
          throw new Error('Store not found');
        }
          const updatedUser = await User.findByIdAndUpdate(
            employeeId,
            { store: newStoreId },
            { new: true, runValidators: true }
          ).populate('store');
      
          if (!updatedUser) { // This should ideally not happen after the employee check above
            res.status(404);
            throw new Error('Employee not updated');
          }
          res.json(updatedUser);
        }),
        
      changePassword:asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        
          if (!currentPassword || !newPassword) {
            res.status(400);
            throw new Error('Current password and new password are required');
          }
        
          const user = await User.findById(req.user.id); // Get the user from the database
        
          if (!user) {
            res.status(404);
            throw new Error('User not found');
          }
        
          // 1. Check current password
          const isMatch = await bcrypt.compare(currentPassword, user.password);
        
          if (!isMatch) {
            res.status(401);
            throw new Error('Incorrect current password');
          }
        
          // 2. Hash the new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
        
          // 3. Update the user's password
          user.password = hashedPassword; // Direct update
          await user.save(); // Save the changes
        
          res.json({ message: 'Password updated successfully' });
        }),

      logoutUser:asyncHandler(async(req,res)=>{
        res.clearCookie('token')
        res.json({ message: 'Logged out successfully' });
    }),
  };
  

module.exports = userController