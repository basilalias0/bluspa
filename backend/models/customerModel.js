const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
},
  lastName: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true 
},
  phone: String,
  bookings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Reservation'
  }],
  marketingAgreement: { 
    type: Boolean 
},
  marketingAgreementDate: Date,
},{
    timestamps: true
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;