const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const mongoose = require('mongoose')

const { userRouter } = require('./routes/user')
const { blogRouter } = require('./routes/blog')
const { reportRouter } = require('./routes/report')
app.use('/api/v1/user', userRouter)
app.use('/api/v1/blog', blogRouter)
app.use('/api/v1/report', reportRouter)

const main = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB is connected");
    } catch (error) {
        console.log("Failed to connect to the database", error)
    }
}

app.listen(3000, () => {
    console.log("server is running...");
})
main()