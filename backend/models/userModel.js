const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true 
    },
  email: { 
    type: String, 
    required: true,
    unique: true 
    },
    password:{
        type:String,
        required:true,

    },
  role: { 
    type: String, 
    enum: ['Administrator', 'Manager', 'Employee'], 
    default:'Employee',
    required: true 
    },
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store' 
}, // For Managers and Employees
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User