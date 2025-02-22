const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerAuthSchema = new mongoose.Schema({
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
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
}, {
    timestamps: true,
});

const CustomerAuth = mongoose.model('CustomerAuth', customerAuthSchema);
module.exports = CustomerAuth;