const { Router } = require('express');
const blogRouter = Router();
const { blogModel } = require('../config/db')
const { userMiddleware } = require('../middleware/userMiddleware');

// Add blog
blogRouter.post('/addblog', userMiddleware, async (req, res) => {
    const userId = req.userId
    const { title, description, pictures, hashtags, links } = req.body
    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        });
    }
    try {
        const newBlog = await blogModel.create({
            userId: userId,
            title,
            description,
            hashtags: hashtags || [],
            links: links || [],
            pictures: pictures || []
        })
        res.json({
            message: "blog created successfully",
            blog: newBlog
        })
    } catch (error) {
        res.status(500).json({
            messsage: "server error",
            error: error.message
        })
    }
});

// Delete blog
blogRouter.delete('/deletetodo/:id', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const blogId = req.params.id;


    try {
        const deletetodo = await blogModel.findOneAndDelete({ _id: blogId, userId: userId })
        if (!deletetodo) {
            return res.status(404).json({
                message: "Blog not found or you are not allowed to delete it"
            })
        }
        res.json({
            message: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Update blog
blogRouter.patch('/updatetodo/:id', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const blogId = req.params.id;
    const { title, description, pictures, hashtags, links } = req.body
    try {
        const updatedBlog = await blogModel.findOneAndUpdate(
            {
                _id: blogId,     
                userId: userId      
            },
            {
                $set: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(pictures && { pictures }),
                    ...(hashtags && { hashtags }),
                    ...(links && { links })
                }
            },
            { new: true }
        );
       if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found OR you are not allowed to update"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

blogRouter.get('/all' , async(req,res) => {
    try {
        const blogs = await blogModel.find().populate("userId","username pfp")
        res.json({blogs})
    } catch (error) {
    res.status(500).json({message: "Server error", error: error.message })        
    }
})

module.exports = {
    blogRouter: blogRouter
};
