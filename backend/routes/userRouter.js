const express = require('express')
const userController = require('../controller/userController')
const isAuth = require('../middlewares/isAuth')
const authorize = require('../middlewares/authorize')
const userRouter = express.Router()


userRouter.post("/register",userController.register)
userRouter.post("/login",userController.loginUser)
userRouter.put("/change-password",isAuth,userController.changePassword)
userRouter.put("/change-store",isAuth,authorize("Admin","Manager"),userController.reassignUserToStore)
userRouter.get("/logout",userController.logoutUser)


module.exports = userRouter