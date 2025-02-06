const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');

const roomController = {
  getRooms: asyncHandler(async (req, res) => {
    const rooms = await Room.find(); // Get all rooms
    res.json(rooms);
  }),

  getRoomById: asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.json(room);
  }),

  createRoom: asyncHandler(async (req, res) => {
    const { title, notes, store } = req.body;

    if (!title || !store) { // Title and store are required
      res.status(400);
      throw new Error('Please provide all required fields (title and store)');
    }

    const room = await Room.create({
      title,
      notes,
      store,
    });

    res.status(201).json(room);
  }),

  updateRoom: asyncHandler(async (req, res) => {
    const { title, notes, store } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { title, notes, store },
      { new: true, runValidators: true } // Run validators on update
    );

    res.json(updatedRoom);
  }),

  deleteRoom: asyncHandler(async (req, res) => {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.status(204).end();
  }),
};

module.exports = roomController;