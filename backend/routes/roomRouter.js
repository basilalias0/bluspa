const express = require('express');
const roomController = require('../controller/roomController');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const roomRouter = express.Router();


roomRouter.get('/', roomController.getRooms);
roomRouter.get('/:id', roomController.getRoomById);
roomRouter.post('/', isAuth,authorize("Manager"),roomController.createRoom);
roomRouter.put('/:id',isAuth,authorize("Manager"), roomController.updateRoom); 
roomRouter.delete('/:id',isAuth,authorize("Manager"), roomController.deleteRoom); 

module.exports = router;