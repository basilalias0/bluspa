const Customer = require("../models/customerModel");

const customerController = {
    getAllCustomers: async (req, res) => {
        try {
          const { search, firstName, lastName, email, phone, marketingAgreement, sortBy, sortOrder } = req.query;
    
          const query = {};
    
          if (search) {
            const searchTerm = new RegExp(search, 'i'); // Case-insensitive regex
            query.$or = [
              { firstName: searchTerm },
              { lastName: searchTerm },
              { email: searchTerm },
              { phone: searchTerm },
            ];
          } else { // Only apply individual filters if no general search is provided
            if (firstName) query.firstName = new RegExp(firstName, 'i');
            if (lastName) query.lastName = new RegExp(lastName, 'i');
            if (email) query.email = new RegExp(email, 'i');
            if (phone) query.phone = new RegExp(phone, 'i');
          }
    
          if (marketingAgreement) {
            query.marketingAgreement = marketingAgreement === 'true';
          }
    
          const sort = {};
          if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
          }
    
          const customers = await Customer.find(query).sort(sort);
          res.json(customers);
    
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },
  
    getCustomerById: async (req, res) => {
      try {
        const customer = await Customer.findById(req.params.id).populate('bookings'); // Populate bookings
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  
    createCustomer: async (req, res) => {
        try {
          const { firstName, lastName, email, phone, marketingAgreement, marketingAgreementDate } = req.body;
      
          // 1. Validate required fields
          if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'First name, last name, and email are required' });
          }
      
          // 2. Check if email already exists (important for uniqueness constraint)
          const existingCustomer = await Customer.findOne({ email });
          if (existingCustomer) {
            return res.status(400).json({ message: 'Email already exists' });
          }
      
          // 3. Create the new customer
          const newCustomer = new Customer({
            firstName,
            lastName,
            email,
            phone,
            marketingAgreement,
            marketingAgreementDate,
          });
      
          const savedCustomer = await newCustomer.save();
          res.status(201).json(savedCustomer);
      
        } catch (err) {
          if (err.name === 'ValidationError') { // Mongoose validation errors
            return res.status(400).json({ message: err.message }); // Send specific validation error messages
          } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) { // Duplicate email error
              return res.status(400).json({ message: 'Email already exists' });
          }
          console.error(err); // Log the error for debugging
          res.status(500).json({ message: 'Server error. Please try again later.' }); // Generic error message for the client
        }
      },
  
      updateCustomer: async (req, res) => {
        try {
          const { firstName, lastName, email, phone, marketingAgreement, marketingAgreementDate } = req.body;
          const customerId = req.params.id;
      
      
          // 2. Check if the email is being updated and if it's already in use by *another* customer
          if (email && email !== (await Customer.findById(customerId)).email) { // Check if email changed
              const existingCustomer = await Customer.findOne({ email });
              if (existingCustomer) {
                return res.status(400).json({ message: 'Email already exists' });
              }
          }
      
          // 3. Update the customer
          const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            { firstName, lastName, email, phone, marketingAgreement, marketingAgreementDate },
            { new: true, runValidators: true } // Important: runValidators!
          );
      
          if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
          }
      
          res.json(updatedCustomer);
      
        } catch (err) {
          if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
          } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) { // Duplicate email error
              return res.status(400).json({ message: 'Email already exists' });
          }
      
          console.error(err);
          res.status(500).json({ message: 'Server error. Please try again later.' });
        }
      },
      
  
    deleteCustomer: async (req, res) => {
      try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
        res.status(204).end();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  
    // ... other customer controller methods (if needed)
  };
  
  module.exports = customerController;