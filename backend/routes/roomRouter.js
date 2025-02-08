const express = require('express');
const roomController = require('../controller/roomController');
const isAuth = require('../middlewares/isAuth');
const authorize = require('../middlewares/authorize');
const roomRouter = express.Router();


roomRouter.get('/',isAuth, roomController.getRooms);
roomRouter.get('/:id',isAuth, roomController.getRoomById);
roomRouter.post('/', isAuth,authorize("Admin","Manager"),roomController.createRoom);
roomRouter.put('/:id',isAuth,authorize("Admin","Manager"), roomController.updateRoom); 
roomRouter.delete('/:id',isAuth,authorize("Admin","Manager"), roomController.deleteRoom); 

module.exports = router;