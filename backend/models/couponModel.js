const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  code: String,
  type: { 
    type: String, 
    enum: ['Fixed', 'Percentage'], 
    required: true 
  },
  discount: { 
    type: Number, 
    required: true 
  },
  preconditions: {
    guests: [Number],
    durations: [Number],
    times: [String], // Array of time ranges?
    weekdays: [String], // e.g., ['Monday', 'Tuesday', ...]
    products: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Product' 
    }],
  },
  applyTo: [String], // e.g., ['Suite', 'Packages', 'SpecificPackageId']
  startDate: Date,
  expiryDate: Date,
  limitPerCustomer: {
    type: Boolean, 
    default: false
  },
  notes: String,
},{
  timestamps: true
});

const Coupon = mongoose.model('Coupon', CouponSchema);
module.exports = Coupon;
