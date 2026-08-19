import Post from "../models/post.model.js";
import asyncHandler from "../utils/async.handler.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import cloudinary from "../config/cloud.config.js";
import User from "../models/user.model.js";
import fs from 'fs/promises'
import { isObjectIdOrHexString } from "mongoose";
import { io } from '../app.js'
import Notification from "../models/notification.model.js";




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
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "firstName lastName headings profileImage userName").populate("comments.user", "firstName lastName profileImage");
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

    if (!isLiked && post.author != userId) {
        const notification = await Notification.create({
            reciever: post.author,
            type: "like",
            relatedUser: userId,
            relatedPost: postId
        })
    }
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        updateOperator,
        { returnDocument: 'after' }
    );
    io.emit("likeUpdated", { postId, likes: updatedPost.likes });

    res.status(200).json(new ApiResponse(200, updatedPost, "Like status updated successfully"));
});

export const handleComment = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $push: { comments: { content, user: userId } }
    }, { returnDocument: 'after' })
        .populate("comments.user", "firstName lastName profileImage headline")
    if (userId != updatedPost.author) {
        const notification = await Notification.create({
            reciever: updatedPost.author._id,
            type: "comment",
            relatedUser: userId,
            relatedPost: postId
        })
    }

    io.emit("commentAdded", { postId, comm: updatedPost.comments })
    res.status(201).json(new ApiResponse(201, updatedPost, "Comment Added."));
})


export const deleteComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) {
        throw new ApiError(400, "Post ID and Comment ID are required.");
    }
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }
    // post.comments.id(commentId) is a Mongoose method for finding a specific subdocument inside an array.
    const comment = post.comments.id(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }
    const isCommentOwner = comment.user.toString() === userId.toString();
    const isPostOwner = post.author.toString() === userId.toString();
    if (!isCommentOwner && !isPostOwner) {
        throw new ApiError(403, "Unauthorized.");
    }
    // post.comments.pull(commentId) removes the comment with that _id from the comments array.
    post.comments.pull(commentId);
    await post.save();
    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully."));
});

export const editComment = asyncHandler(async (req, res)=>{
    const { postId, commentId} = req.params;
    const { editedComment } = req.body;
    if(!postId || !commentId || !editedComment){
        throw new ApiError(400, "Invalid Credentials !");
    }
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(401, "Invalid Post!");
    }
    const comment = post.comments.id(commentId);
    if(!comment){
        throw new ApiError(401, "Comment not found!");
    }
    const isCommentOwner = comment.user.toString() === req.userId;
    if(!isCommentOwner){
        throw new ApiError(402, "unauthorized access.");
    }
    comment.content = editedComment;
    await post.save();
    return res.status(200).json(new ApiResponse(200, {}, "Comment Updated!"));
})