const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' }], // Or a more detailed item schema
    amount: Number,
    paymentMethod:{
        type:String,
        enum: ['cash', 'card', 'paypal'],
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Refunded'], 
        default: 'Pending' 
    },
    notes: String,
    
  },{
    timestamps: true
  });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order