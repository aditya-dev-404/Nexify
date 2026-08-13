import asyncHandler from '../utils/async.handler.js'
import Notification from '../models/notification.model.js'
import ApiResponse from '../utils/api.response.js'
import ApiError from '../utils/api.error.js'


export const getNotification = asyncHandler(async(req, res)=>{
    const notifications = await Notification.find({reciever:req.userId})
    .populate("relatedUser", 'firstName lastName profileImage userName')
    .populate("relatedPost", "images description")
    if(!notifications){
        throw new ApiError(400, "No notifications found.");
    }
    return res.status(200).json(new ApiResponse(200, notifications, "Your Notifications."))
})

export const deleteNotification = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    if(!id){
        throw new ApiError("Can't delete Notification.");
    }
    await Notification.deleteOne({_id:id, reciever:req.userId});
    return res.status(201).json(new ApiResponse(201, {}, "Notification Deleted."));
})

export const deleteAllNotifications = asyncHandler(async(req, res)=>{
    await Notification.deleteMany({reciever:req.userId});
    return res.status(201).json(new ApiResponse(201, {}, "Notifications Deleted."));
})