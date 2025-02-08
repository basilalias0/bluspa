const express = require('express')
const connectDB = require('./DB/connectDB')
const errorHandler = require('./middlewares/errorHandler')
const router  = require('./routes')
const cookieParser =require('cookie-parser')
const app = express()

connectDB()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1",router)

app.use(errorHandler)


app.listen(5000,()=>{
    console.log('server is running on port 5000')
})