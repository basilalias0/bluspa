const express = require('express')
const UserController = require('../controller/userController')
const userRouter = express.Router()


userRouter.post("/register",UserController.register)
userRouter.post("/login",UserController.loginUser)
userRouter.post("/logout",UserController.logoutUser)


module.exports = userRouter