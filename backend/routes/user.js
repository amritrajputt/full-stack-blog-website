const express = require('express')
const app = express()
app.use(express.json())
const { z } = require('zod')
const { Router } = require('express')
const userRouter = Router()
const { userModel } = require('../config/db')
const bcrypt = require('bcrypt')

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
            error:  parsedData.error.issues
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

userRouter.post('/signin', (req, res) => {

})

app.get('blogs', (req, res) => {

})