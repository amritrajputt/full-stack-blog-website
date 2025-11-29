const { Router } = require('express')
const { userMiddleware } = require('../middleware/userMiddleware')
const reportRouter = Router()
const { reportModel, blogModel } = require('../config/db')

reportRouter.post('/:id', userMiddleware, async (req, res) => {
    const blogId = req.params.id;
    const userId = req.userId
    const { message, type } = req.body
    try {
        const newReport = await reportModel.create({
            blogId,
            message,
            type,
            reporterId: userId
        });
        await blogModel.findByIdAndUpdate(blogId, {
            $push: { report: newReport._id }

        })
        res.json({
            message: "Report submitted successfully",
            report: newReport

        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
})
module.exports = {
    reportRouter: reportRouter
};