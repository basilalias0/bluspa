const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    openingHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
        },
        open: String, // e.g., '9:00 AM'
        close: String, // e.g., '5:00 PM'
    }],
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    location: {
        latitude: Number,
        longitude: Number,
    },
    image: String,
    status: {
        type: String,
        enum: ['open', 'closed', 'maintenance'],
        default: 'open',
    },
});

const Store = mongoose.model('Store', StoreSchema);
module.exports = Store;