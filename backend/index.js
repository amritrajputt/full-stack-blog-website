const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const mongoose = require('mongoose')

const { userRouter } = require('./routes/user')


app.use('/api/v1/user', userRouter)

const main = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB is connected");
    } catch (error) {
         console.log("Failed to connect to the database", error)
    }
}

app.listen(3000, () => {
    console.log("server is running...");
})
main()