const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
require('dotenv').config()


const UserController = {
    register: asyncHandler(async (req, res) => {
      const { name, password, email } = req.body;
  
      // Consolidated validation and error handling
      if (!name  || !email || !password) {
        return res.status(400).json({ message: "Data incomplete!" }); // 400 Bad Request
      }
  
      const existingUser = await User.findOne({ email }); // Check both username and email in one query
  
      if (existingUser) {
        return res.status(400).json({ 
          message: "Email already exists!" 
        });
      }
  
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
          name,
          username,
          email,
          password: hashedPassword,
        });
  
        if (!createdUser) {  //Check if user creation was successful
          return res.status(500).json({ message: "User creation failed." }); // 500 Internal Server Error
        }
  
        const payload = { username };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  
        // Simplified cookie setting.  Adjust secure and sameSite as needed for your production environment
        res.cookie('token', token, { 
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          httpOnly: true,
          sameSite: 'strict', // or 'lax' depending on your needs.  'none' requires secure and can have implications
          secure: process.env.NODE_ENV === 'production',  // Only set secure in production
        });
  
        res.status(201).json({
          name,
          username,
          email,
          token,
          id: createdUser._id,
        });
  
      } catch (error) {
        console.error("Error creating user:", error); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong. Please try again later." }); // Generic error message for the client
      }
    })
  };
  

module.exports = UserController