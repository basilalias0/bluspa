const express = require('express')
const userRouter = require('./userRouter')
const customerRouter = require('./customerRouter')
const router = express()

router.use("/user",userRouter)
router.use('/customer',customerRouter)


module.exports = router