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
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Employee'],
        default: 'Employee',
        required: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    profileImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active'
    },
    lastLogin: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;