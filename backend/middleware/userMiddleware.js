const jwt = require('jsonwebtoken')
const { JWT_USER_PASSWORD } = require('../config/config')

const userMiddleware = (req,res,next) => {
    const token = req.headers.token
    if(!token){
        return res.status(403).json({
            message: "Token not provided"
        })
    }
    try {
        const decoded = jwt.verify(token,JWT_USER_PASSWORD)
        req.userId = decoded.id
        next()
    } catch (error) {
          return res.status(403).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = {
    userMiddleware
}