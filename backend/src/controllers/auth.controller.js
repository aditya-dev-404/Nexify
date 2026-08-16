import asyncHandler from '../utils/async.handler.js'
import User from '../models/user.model.js'
import { ENV } from '../config/env.config.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import ApiError from '../utils/api.error.js'
import ApiResponse from '../utils/api.response.js'
import generateToken from '../config/token.js'
import { mailOptionsForOtp, welcomeMailOptions, mailOptionsForResetOtp } from '../config/mail.options.js'
import { sendEmail } from "../config/mail.config.js";

export const signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !userName || !email) {
        throw new ApiError(400, "Fill the Data Correctly");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must contain at least 6 characters.");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

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
        sameSite: "none",
        secure: ENV.NODE_ENV === 'production'
    })
    await sendEmail(welcomeMailOptions(email, firstName));
    res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"))

})

export const sendVerifyEmailOtp = asyncHandler(async(req, res)=>{
    const {email} = req.body
    if(!email){
        throw new ApiError(401, "Email must be present.");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 12);
    const verifyToken = jwt.sign({email,otp:hashedOtp},ENV.SECRET_KEY, {expiresIn : '10m'});
    res.cookie('verifyToken', verifyToken,{
        httpOnly: true,
        maxAge: 10*60*1000,
        sameSite:"none",
        secure: ENV.NODE_ENV === 'production'
    })

    await sendEmail(mailOptionsForOtp(email, otp));
    return res.status(201).json(new ApiResponse(201,{}, "Otp Sent."));
})

export const verifyOtp = asyncHandler(async(req, res)=>{
    const {otp, email} = req.body;
    if(!otp || !email){
        throw new ApiError(401, "Enter valid credentials.");
    }
    const {verifyToken} = req.cookies;
    if(!verifyToken){
        throw new ApiError(400, "Token Doesn't Exists.")
    }
    const stored = jwt.verify(verifyToken, ENV.SECRET_KEY);
    if(!stored.otp || !stored.email){
        throw new ApiError(404, "No information found.");
    }
    if(email !== stored.email){
        throw new ApiError(404, "Unauthorized.");
    }
    const otpMatched = await bcrypt.compare(otp, stored.otp);
    if(!otpMatched){
        return res.status(401).json(new ApiResponse(401,null, "Invalid Otp."))
    }
    res.cookie("verifyToken", verifyToken, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    sameSite: "none",
    secure: true
});
    return res.status(200).json(new ApiResponse(200, {}, "Otp verified."));
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
        sameSite : "none",
        secure : ENV.NODE_ENV === 'production'
    })
    const loggedInUser = await User.findById(user._id).select('-password');
    res.status(200).json(new ApiResponse(200, loggedInUser, "User Logged in."))
})

export const logout = asyncHandler( async (req, res)=>{
    res.clearCookie("token");
    res.status(204).json(new ApiResponse(204, {}, "User has been Logged Out."))
})

export const sendResetPassOtp = asyncHandler(async(req, res)=>{
    const {email} = req.body
    if(!email){
        throw new ApiError(401, "Enter valid email.")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401, "Enter a valid email.")
    }
    const otp = Math.floor(100000+Math.random()*900000).toString();
    user.resetPassOtp = otp;
    user.resetPassOtpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendEmail(mailOptionsForResetOtp(email, otp));
    return res.status(200).json(new ApiResponse(200, {}, "Reset Password otp has been sent to provided Email."));
})

export const verifyResetPassOtp = asyncHandler(async(req, res)=>{
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || otp.length !== 6 || !newPassword){
        throw new ApiError(401, "Enter valid credentials.");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401, "Enter valid Email.");
    }
    if(user.resetPassOtpExpiresAt < Date.now()){
        throw new ApiError(401, "Otp Expired or Invalid otp.");
    }
    if(otp !== user.resetPassOtp){
        throw new ApiError(401, "Otp Expired or Invalid otp.");
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    user.resetPassOtp = null;
    user.resetPassOtpExpiresAt = null;
    await user.save();
    return res.status(201).json(new ApiResponse(201, {}, "Your Password reset Successfull."))
})