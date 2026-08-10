import cloudinary from "../config/cloud.config.js";
import User from "../models/user.model.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import asyncHandler from "../utils/async.handler.js";
import fs from 'fs/promises'
import { ENV } from "../config/env.config.js";

export const getUser = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        throw new ApiError(404, "User doesn't Exists.");
    const user = await User.findById(userId);
    if (!user)
        throw new ApiError(404, "User Not Found");
    res.status(200).json(new ApiResponse(200, user, "User Fetched."))
})

export const updateProfileImage = asyncHandler(async (req, res) => {

})

export const updateUserProfile = asyncHandler(async (req, res) => {

    const { firstName, lastName, headings, location,
        gender, skills, education, exprience } = req.body;

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let profileImageUrl = user.profileImage;
    let coverImageUrl = user.coverImage;

    if (req.files?.profileImage?.[0]) {

        const profileUpload = await cloudinary.uploader.upload(req.files.profileImage[0].path, {
            folder: `nexify/profilePotos/${user.userName}`,
            public_id: 'profile-image',
            overwrite: true,      // Replaces the old file on Cloudinary
            invalidate: true      // Clears Cloudinary CDN cache instantly
        });
        profileImageUrl = { url: profileUpload.secure_url, public_id: profileUpload.public_id } // Save only the string URL
        fs.unlink(req.files.profileImage[0].path)
    }

    if (req.files?.coverImage?.[0]) {
        const coverUpload = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
            folder: `nexify/coverPhotos/${user.userName}`,
            public_id: 'cover-image',
            overwrite: true,
            invalidate: true
        });
        coverImageUrl = { url: coverUpload.secure_url, public_id: coverUpload.public_id } // Save only the string URL
        fs.unlink(req.files.coverImage[0].path)
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.headings = headings || user.headings;
    user.location = location || user.location;
    user.gender = gender || user.gender;
    user.skills = JSON.parse(skills) || user.skills;
    user.education = JSON.parse(education) || user.education;
    user.exprience = JSON.parse(exprience) || user.exprience;
    user.profileImage = profileImageUrl;
    user.coverImage = coverImageUrl;
    const updatedUser = await user.save();
    return res.status(200).json(new ApiResponse(200, updatedUser, 'User Upadated SuccessFully.'));
})


export const getUserDetails = asyncHandler(async (req, res) => {
    const { userName } = req.params;
    if (!userName) {
        throw new ApiError(404, 'Id not found.')
    }
    const user = await User.findOne({ userName }).select('-password -email -userName').populate("connections", "firstName lastName profileImage headings gender");
    if (!user) {
        throw new ApiError(404, "Requested user not exists.");
    }
    return res.status(200).json(new ApiResponse(200, user, "Requested User Fetched Successfully."))
})

export const getSuggestedUsers = asyncHandler(async (req, res) => {
    const currUser = await User.findById(req.userId).select("connection");
    if (!currUser) {
        throw new ApiError(400, "Login first.")
    }
    const suggestedUsers = await User.find({
        _id: { $ne: currUser._id, $nin: currUser.connections }
    }).select("-password -email");
    if (suggestedUsers.length == 0) {
        return res.status(201).json(new ApiResponse(201, {}, "No users to suggest."))
    }
    return res.status(200).json(new ApiResponse(200, suggestedUsers, "Suggested Users"))
})