const mongoose = require('mongoose');

const GiftCardSchema = new mongoose.Schema({
    title: String,
    code: { 
        type: String, 
        unique: true 
    },
    value: { 
        type: Number, 
        required: true 
    },
    remainingValue: Number,
    startDate: Date,
    expiryDate: Date,
    valid: { 
        type: Boolean, 
        default: true 
    },
    customer: { 
        type: Schema.Types.ObjectId, 
        ref: 'Customer' 
    },
    usageHistory: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    notes: String,
  });

  const GiftCard = mongoose.model('GiftCard', GiftCardSchema);
  module.exports = GiftCard;