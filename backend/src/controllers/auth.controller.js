import asyncHandler from '../utils/async.handler.js'
import User from '../models/user.model.js'
import { ENV } from '../config/env.config.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import ApiError from '../utils/api.error.js'
import ApiResponse from '../utils/api.response.js'
import generateToken from '../config/token.js'


export const signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !userName || !email) {
        throw new ApiError(400, "Fill the Data Correctly");
    }
    console.log(req.body);
    if (password.length < 6) {
        throw new ApiError(400, "Password must contain at least 6 characters.");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    console.log(existingUser);
    if (existingUser) {
        throw new ApiError(409, "Invalid User or Email.")
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPass
    })
    const createdUser = await User.findById(user._id).select('-password')
    const token = await generateToken(createdUser._id);
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: ENV.NODE_ENV === 'production'
    })
    res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"))

})

export const login = asyncHandler( async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "Required fields can't be Empty.");
    }
    if(password.length < 6){
        throw new ApiError(400, "Password must be of length atleast 6.")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "Inavalid Email or Password.");
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if(!passMatch){
        throw new ApiError(401, "Invalid Email or Password.");
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
        httpOnly : true, 
        maxAge : 15*24*60*60*1000,
        sameSite : "strict",
        secure : ENV.NODE_ENV === 'production'
    })
    const loggedInUser = await User.findById(user._id).select('-password');
    res.status(200).json(new ApiResponse(200, loggedInUser, "User Logged in."))
})

export const logout = asyncHandler( async (req, res)=>{
    res.clearCookie("token");
    res.status(204).json(new ApiResponse(204, {}, "User has been Logged Out."))
})

