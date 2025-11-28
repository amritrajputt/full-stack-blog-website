const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        pfp: { type: String, default: "" },
        bio: { type: String, default: "" },
    },
    { timestamps: true }
);


const blogsSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        pictures: [
            {
                type: String,
                default: "",
            }
        ],
        hashtags: [{ type: String }],

        links: [{ type: String }],

        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        report: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report", }]
    },
    { timestamps: true }
);

const reportSchema = new Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["typo", "wrong information", "broken link", "plagiarism", "other"],
        default: "other",
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    }

})

const userModel = mongoose.model("User", userSchema);
const blogModel = mongoose.model("Blog", blogsSchema);
const reportModel = mongoose.model("Report", reportSchema);

module.exports = {
    userModel,
    blogModel,
    reportModel
}