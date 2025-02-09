const Customer = require("../models/customerModel");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const customerController = {
    getAllCustomers:asyncHandler(async (req, res) => {
          const { search, name, email, phone, sortBy, sortOrder } = req.query;
    
          const query = {};
    
          if (search) {
            const searchTerm = new RegExp(search, 'i'); // Case-insensitive regex
            query.$or = [
              { name: searchTerm },
              { email: searchTerm },
              { phone: searchTerm },
            ];
          } else { // Only apply individual filters if no general search is provided
            if (name) query.name = new RegExp(name, 'i');
            if (email) query.email = new RegExp(email, 'i');
            if (phone) query.phone = new RegExp(phone, 'i');
          }


          const sort = {};
          if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
          }
    
          const customers = await Customer.find(query).sort(sort);
          res.json(customers);

      }),
  
    getCustomerById: asyncHandler(async (req, res) => {
        const customer = await Customer.findById(req.params.id).populate('bookings'); // Populate bookings
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    }),

    registerCustomer:asyncHandler(async (req, res) => {
      const { name, email, password } = req.body;
    
      if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email, and password are required');
      }
    
      const userExists = await Customer.findOne({ email });
    
      if (userExists) {
        res.status(400);
        throw new Error('Email already exists');
      }
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const userCreated = await Customer.create({
        name,
        email,
        password: hashedPassword,
      });
      if(!userCreated){
        res.status(400).send("User not created");
      }
      const payload = {
        id: userCreated._id, 
        role: userCreated.role 
      }
      const token = jwt.sign(
       payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '3d' } // Example expiry
      );
  
  
      res.cookie('token', token, {
        httpOnly: true, // Important for security
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        sameSite: 'strict', // Adjust sameSite as needed ('strict', 'lax', or 'none' with secure)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
  
      res.status(201).json({
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        role: userCreated.role, // Include the role in the response
        token // You can send the token in the response or just rely on the cookie
      });
    }),

    updateName: asyncHandler(async (req, res) => {
      const { name } = req.body;
      const updatedCustomer = await Customer.findByIdAndUpdate(req.user.id, { name }, { new: true, runValidators: true });
      if (!updatedCustomer) {
        res.status(404);
        throw new Error('Customer not found');
      }
      res.json(updatedCustomer);
    }),
  
    updateEmail: asyncHandler(async (req, res) => {
      const { email } = req.body;
  
          const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer && existingCustomer._id.toString() !== req.user.id) {
        res.status(400);
        throw new Error('Email already exists');
      }
  
      const updatedCustomer = await Customer.findByIdAndUpdate(req.user.id, { email }, { new: true, runValidators: true });
      if (!updatedCustomer) {
        res.status(404);
        throw new Error('Customer not found');
      }
      res.json(updatedCustomer);
    }),
  
    updatePhone: asyncHandler(async (req, res) => {
      const { phone } = req.body;
      const updatedCustomer = await Customer.findByIdAndUpdate(req.user.id, { phone }, { new: true, runValidators: true });
      if (!updatedCustomer) {
        res.status(404);
        throw new Error('Customer not found');
      }
      res.json(updatedCustomer);
    }),
  
    updatePassword: asyncHandler(async (req, res) => {
      const { password } = req.body;
  
      if (!password) {
        res.status(400);
        throw new Error('Password is required');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const updatedCustomer = await Customer.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true, runValidators: true });
      if (!updatedCustomer) {
        res.status(404);
        throw new Error('Customer not found');
      }
      res.json(updatedCustomer);
    }),
      
  
    deleteCustomer:asyncHandler( async (req, res) => {
        const deletedCustomer = await Customer.findByIdAndDelete(req.user.id) || req.params.id;
        if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
        res.status(204).end();
    }),
  
    // ... other customer controller methods (if needed)
  };
  
  module.exports = customerController;