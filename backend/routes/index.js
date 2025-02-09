const express = require('express')
const userRouter = require('./userRouter')
const customerRouter = require('./customerRouter')
const notificaionRouter = require('./notificationRouter')
const transactionRouter = require('./transactionRoute')
const roomRouter = require('./roomRouter')
const storeRouter = require('./storeRouter')
const router = express()

router.use("/user",userRouter)
router.use('/customer',customerRouter)
router.use("/notification",notificaionRouter)
router.use("/transaction",transactionRouter)
router.use('/room',roomRouter)
router.use('/store',storeRouter)

module.exports = router