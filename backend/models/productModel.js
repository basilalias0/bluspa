const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
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
    allergens: [String], // Or a separate Allergen schema
    onlineOrderable: { 
        type: Boolean, 
        default: false 
    },
    onLocationOrderable: { 
        type: Boolean, 
        default: false 
    },
    orderLimit: Number,
    category: String,
    upgrades: [{
        title: String,
        description: String,
        price: Number,
        available: {type: Boolean, default: true}
    }],
    notes: String,
  },{
    timestamps:true
  });

  const Product = mongoose.model('Product', ProductSchema);
  module.exports = Product;