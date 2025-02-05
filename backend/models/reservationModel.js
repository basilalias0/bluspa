const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    room: { 
        type: Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    }, // Use a string like 'HH:MM'
    duration: { 
        type: Number, 
        required: true 
    }, // In hours
    guests: { 
        type: Number, 
        required: true 
    },
    packages: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Package' 
    }],
    coupons: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Coupon' 
    }],
    giftCards: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'GiftCard' 
    }],
    customer: { 
        type: Schema.Types.ObjectId, 
        ref: 'Customer' 
    },
    notes: String,
    history: [{ type: Object }], // Store creation, updates, cancellations, etc.
    
  },{
    timestamps: true
  });

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;