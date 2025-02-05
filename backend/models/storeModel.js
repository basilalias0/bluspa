const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    address: {
        type: String,
        required: true
    },
    openingHours: { type: Object }, // Store opening hours data
    email:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
  });

  const Store = mongoose.model('Store', StoreSchema);
  module.exports = Store;