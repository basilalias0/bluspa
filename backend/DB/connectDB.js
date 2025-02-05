const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connected successfully");
    
}

module.exports = connectDB