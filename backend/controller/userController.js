const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
require('dotenv').config()


const UserController = {
    register: asyncHandler(async (req, res) => {
      const { name, password, email,role } = req.body;
  
      // Consolidated validation and error handling
      if (!name  || !email || !password) {
        return res.status(400).json({ message: "Data incomplete!" }); // 400 Bad Request
      }
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ 
          message: "Email already exists!" 
        });
      }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
          name,
          username,
          email,
          role,
          password: hashedPassword,
        });
  
        if (!createdUser) {  //Check if user creation was successful
          return res.status(500).json({ message: "User creation failed." }); // 500 Internal Server Error
        }
  
        const payload = { name,role };
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
          token
        });
    }),
    loginUser: asyncHandler(async (req, res) => {
        const { username, password } = req.body;
      
        const userFound = await User.findOne({ username });
      
        if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
          res.status(401); // Set Unauthorized status
          throw new Error("Invalid credentials"); // Throw error for the error handler
        }
      
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
      logoutUser:asyncHandler(async(req,res)=>{
        res.clearCookie('token')
        res.json({ message: 'Logged out successfully' });
    }),
  };
  

module.exports = UserController