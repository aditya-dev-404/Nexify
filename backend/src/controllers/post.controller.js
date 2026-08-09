import Post from "../models/post.model.js";
import asyncHandler from "../utils/async.handler.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import cloudinary from "../config/cloud.config.js";
import User from "../models/user.model.js";
import fs from 'fs/promises'
import { isObjectIdOrHexString } from "mongoose";
import {io} from '../app.js'




export const createPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    let uploadedImages = [];
    if (req.files?.length) {
        const uploadResults = await Promise.all(
            req.files.map((file) =>
                cloudinary.uploader.upload(file.path, {
                    folder: `nexify/posts/${user.userName}`
                })
            )
        );
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
        uploadedImages = uploadResults.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url
        }));
    }
    const createdPost = await Post.create({
        author: user._id,
        description,
        images: uploadedImages
    });
    console.log(createdPost);
    res.status(201).json(new ApiResponse(201, createdPost, "Post Created Successfully."));
});

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "firstName lastName headings profileImage").populate("comments.user", "firstName lastName profileImage");
    res.status(200).json(new ApiResponse(200, posts, "All Posts Fetched Successfully."))
})

export const handleLike = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post does not exist.");
    }
    const isLiked = post.likes.some(id => id.toString() === userId.toString());
    const updateOperator = isLiked 
        ? { $pull: { likes: userId } }  // Remove like
        : { $addToSet: { likes: userId } }; // Add like uniquely

    const updatedPost = await Post.findByIdAndUpdate(
        postId, 
        updateOperator, 
        { returnDocument: 'after' } 
    );
    io.emit("likeUpdated", {postId, likes:updatedPost.likes});
    
    res.status(200).json(new ApiResponse(200, updatedPost, "Like status updated successfully"));
});

export const handleComment = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;
    const {content} = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $push : {comments:{content, user:userId}}
    },{returnDocument:'after'})
    .populate("comments.user", "firstName lastName profileImage headline")
    io.emit("commentAdded", {postId, comm: updatedPost.comments})
    res.status(201).json(new ApiResponse(201, updatedPost, "Comment Added."));
})
