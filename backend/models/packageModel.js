const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    image: String,
    price: { 
        type: Number, 
        required: true 
    },
    taxRate: Number, // 0, 7, 19
    available: { 
        type: Boolean, 
        default: true 
    },
    exclusive: { 
        type: Boolean, 
        default: false 
    },
    guestLimit: [Number], // Array of allowed guest numbers
    notes: String,
    products: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }], // Associated products
  },{
    timestamps: true
  });

const Package = mongoose.model('Package', PackageSchema);
module.exports = Package;