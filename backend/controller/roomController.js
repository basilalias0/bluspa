const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');
const mongoose = require('mongoose');

const roomController = {
    getRooms: asyncHandler(async (req, res) => {
        try {
            const rooms = await Room.find();
            res.json(rooms);
        } catch (error) {
            console.error('Error in getRooms:', error);
            res.status(500).json({ message: 'Internal server error while fetching rooms' });
        }
    }),

    getRoomById: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid Room ID' });
            }
            const room = await Room.findById(req.params.id);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.json(room);
        } catch (error) {
            console.error('Error in getRoomById:', error);
            res.status(500).json({ message: 'Internal server error while fetching room' });
        }
    }),

    createRoom: asyncHandler(async (req, res) => {
        try {
            const { title, notes, store } = req.body;

            if (!title || !store) {
                return res.status(400).json({ message: 'Please provide all required fields (title and store)' });
            }

            if (!mongoose.Types.ObjectId.isValid(store)) {
                return res.status(400).json({ message: 'Invalid Store ID' });
            }

            const room = await Room.create({
                title,
                notes,
                store,
            });

            res.status(201).json(room);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            console.error('Error in createRoom:', error);
            res.status(500).json({ message: 'Internal server error while creating room' });
        }
    }),

    updateRoom: asyncHandler(async (req, res) => {
        try {
            const { title, notes, store } = req.body;

            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid Room ID' });
            }

            if (store && !mongoose.Types.ObjectId.isValid(store)) {
                return res.status(400).json({ message: 'Invalid Store ID' });
            }

            const room = await Room.findById(req.params.id);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            const updatedRoom = await Room.findByIdAndUpdate(
                req.params.id,
                { title, notes, store },
                { new: true, runValidators: true }
            );

            res.json(updatedRoom);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            console.error('Error in updateRoom:', error);
            res.status(500).json({ message: 'Internal server error while updating room' });
        }
    }),

    deleteRoom: asyncHandler(async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid Room ID' });
            }

            const deletedRoom = await Room.findByIdAndDelete(req.params.id);

            if (!deletedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.status(204).end();
        } catch (error) {
            console.error('Error in deleteRoom:', error);
            res.status(500).json({ message: 'Internal server error while deleting room' });
        }
    }),
};

module.exports = roomController;