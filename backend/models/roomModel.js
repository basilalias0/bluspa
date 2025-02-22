const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    notes: String,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'maintenance'],
        default: 'available',
    },
    capacity: Number,
    type: String,
    image: String,
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;