const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    notes: String,
    store: { 
        type: Schema.Types.ObjectId, 
        ref: 'Store' 
    },
  },{
    timestamps: true
  });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;