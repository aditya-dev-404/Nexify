import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config.js';
import ApiError from '../utils/api.error.js';
import asyncHandler from '../utils/async.handler.js';

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const {token} = req.cookies ;
    if(!token){
        throw new ApiError(401, "Invalid User.");
    }
    const verified = await jwt.verify(token, ENV.SECRET_KEY);
    if(!verified){
        throw new ApiError(401, "Invalid User.");
    }
    req.userId = verified.id;
    next();
})

export {isAuthenticated};