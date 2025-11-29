const express = require('express')
const app = express()
app.use(express.json())
const { z } = require('zod')
const { Router } = require('express')
const userRouter = Router()
const { userModel, blogModel } = require('../config/db')
const { JWT_USER_PASSWORD } = require('../config/config')
const bcrypt = require('bcrypt')
const { userMiddleware } = require('../middleware/userMiddleware')
const jwt = require('jsonwebtoken')

userRouter.post('/signup', async (req, res) => {

    const requiredInput = z.object({
        email: z.string().email(),
        name: z.string().min(3).max(30),
        username: z.string().min(3).max(30),
        password: z.string()
            .min(8)
            .max(30)
            .refine(v => [...v].some(c => c >= "A" && c <= "Z"), {
                message: "Password must contain at least one uppercase letter"
            })
            .refine(v => [...v].some(c => c >= "a" && c <= "z"), {
                message: "Password must contain at least one lowercase letter"
            })
            .refine(v => [...v].some(c => c >= "0" && c <= "9"), {
                message: "Password must contain at least one numeric letter"
            })
            .refine(v => [...v].some(c => c == "@" || c == "!" || c == "&" || c == "%" || c == "^" || c == "$" || c == "#" || c == "~"), {
                message: "Password must contain at least one special character"
            })
    })
    const parsedData = requiredInput.safeParse(req.body)
    if (!parsedData.success) {
        res.json({
            message: "Incorrect format",
            error: parsedData.error.issues
        })
        return
    }
    const { name, username, email, password } = parsedData.data;

    try {
        const checkUserExist = await userModel.findOne({ email })
        if (checkUserExist) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const checkUsernameAvailable = await userModel.findOne({ username })
        if (checkUsernameAvailable) {
            return res.status(400).json({
                message: "Username not available"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.create({
            email: email,
            password: hashedPassword,
            name: name,
            username: username
        })
        res.json({ message: "You are signed up" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

userRouter.post('/signin', async (req, res) => {
    const { username, email, password } = req.body
    const user = await userModel.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        res.status(403).json({
            message: "User doesn't exist in our DB"
        })
        return
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (checkPassword) {
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD)
        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

userRouter.get('/myblogs', userMiddleware, async (req, res) => {
    const userId = req.userId
    const myBlogs = await blogModel.find({
        userId
    })


    res.json({
        message: "Purchased courses",
        blogs: myBlogs
    })
})

module.exports = {
    userRouter: userRouter
}