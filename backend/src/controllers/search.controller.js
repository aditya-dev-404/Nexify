import User from "../models/user.model.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import asyncHandler from "../utils/async.handler.js";

export const search = asyncHandler(async(req, res)=>{
    const {query} = req.query
    if(!query){
        throw new ApiError(400, "Missing Query Parameters.")
    }
    const searchRegex = new RegExp(query, "i");
    const result = await User.find({
        $or:[
            {firstName:{$regex:query,$options:"i"}},
            {lastName:{$regex:query,$options:"i"}},
            {userName:{$regex:query,$options:"i"}},
            {headings:{$regex:query,$options:"i"}},
            {skills: { $elemMatch: { $regex: searchRegex } }}
        ]
    })
    return res.status(200).json(new ApiResponse(200, result, "Search Results"))
})