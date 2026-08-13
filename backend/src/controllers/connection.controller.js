import asyncHandler from "../utils/async.handler.js";
import Connection from "../models/connection.model.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import User from "../models/user.model.js";
import {io} from '../app.js'
import Notification from "../models/notification.model.js";

const emitStatusUpdate = (userId, updatedUserId, newStatus) => {
    io.to(`user:${userId}`).emit("statusUpdate", { updatedUserId: String(updatedUserId), newStatus });
};


export const sendConnectionRequest = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const senderId = req.userId;
    if( id === senderId){
        throw new ApiError(400, "Can't sent request to Yourself");
    }
    const sender = await User.findById(senderId);
    const receiver = await User.findById(id);
    const alreadyConnected =
        sender.connections.some(connectionId => connectionId.toString() === id) ||
        receiver.connections.some(connectionId => connectionId.toString() === senderId);

    if(alreadyConnected){
        throw new ApiError(401, "Already connected.");
    }
    const existingConnection = await Connection.findOne({
        sender: senderId, 
        reciever : id,
        status:"pending"
    })
    if(existingConnection){
        throw new ApiError(401, "Connection Request Already sent, wait for the response")
    }
    const newConnection = await Connection.create({
        sender: senderId,
        reciever: id,
        status : 'pending'
    })
    await Notification.create({
        reciever:id,
        type:"connection",
        relatedUser:senderId,
        relatedPost: null,
    })
    emitStatusUpdate(id, senderId, "recieved");
    emitStatusUpdate(senderId, id, "pending");

    return res.status(200).json(new ApiResponse(200, newConnection, "Connection Sent successfully"));
})

export const acceptConnectionRequest = asyncHandler(async(req, res)=>{
    const { id } = req.params;//connection id
    const userId = req.userId;
    if(!id){
        throw new ApiError(400, "can't find any id")
    }
    const connection = await Connection.findById(id);
    if(!connection){
        throw new ApiError(404, "connection doesn't exists send connection");
    }
    if(connection.status !== 'pending'){
        throw new ApiError(400, "connection request is not pending, send new request");
    }
    connection.status = 'accepted';
    await connection.save();
    await User.findByIdAndUpdate(userId, {
        $addToSet:{connections:connection.sender}
    })
    await User.findByIdAndUpdate(connection.sender, {
        $addToSet:{connections:connection.reciever}
    })
        await Notification.create({
        reciever:connection.sender,
        type:"connection",
        relatedUser:userId,
        relatedPost: null,
    })

    emitStatusUpdate(connection.reciever, connection.sender, "connected");
    emitStatusUpdate(connection.sender, connection.reciever, "connected");


    return res.status(200).json(new ApiResponse(200, {}, "connection Accepted."))

})

export const rejectConnectionRequest = asyncHandler(async(req, res)=>{
    const { id } = req.params;//connection id
    const userId = req.userId;
    if(!id){
        throw new ApiError(400, "can't find any id")
    }
    const connection = await Connection.findById(id);
    if(!connection){
        throw new ApiError(404, "connection doesn't exists send connection");
    }
    if(connection.status !== 'pending'){
        throw new ApiError(400, "connection request is not pending, send new request");
    }
    connection.status = 'rejected'
    await connection.save()
    emitStatusUpdate(connection.reciever, connection.sender, "connect");
    emitStatusUpdate(connection.sender, connection.reciever, "connect");
    
    return res.status(201).json(new ApiResponse(201, {}, "connection request rejected."))
})

export const getConnectionStatus = asyncHandler(async(req, res)=>{
    const targetUserId = req.params.id;
    const currUserId = req.userId;

    const pendingReq = await Connection.findOne({
        $or:[
            {sender: currUserId, reciever:targetUserId},
            {sender:targetUserId, reciever:currUserId}
        ], 
        status:'pending',
    })
    if(pendingReq){
        if(pendingReq.sender.toString() === currUserId.toString()){
            return res.status(200).json(new ApiResponse(200, {status:"pending"}, "wait for accepting the request."))
        }else{
            return res.status(200).json(new ApiResponse(200, {status:"recieved"}, "accept the connection request."))
        }
    }

    const currentUser = await User.findById(currUserId)
    if(currentUser.connections.some(connectionId => connectionId.toString() === targetUserId)){
        return res.status(200).json(new ApiResponse(200, {status:'connected'}, 'you are connected to each other.'));
    }

    return res.status(200).json(new ApiResponse(200, {status:"connect"}, "Send Connection Request"))
})

export const removeConnection = asyncHandler(async (req, res) => {
    const myId = req.userId;
    const otherUserId = req.params.id;
    await User.findByIdAndUpdate(myId, {$pull : {connections : otherUserId}});
    await User.findByIdAndUpdate(otherUserId, {$pull : {connections : myId }});
    await Connection.findOneAndDelete({
        $or: [
            { sender: myId, reciever: otherUserId },
            { sender: otherUserId, reciever: myId }
        ],
        status: 'accepted'
    });
    
    emitStatusUpdate(otherUserId, myId, "connect");
    emitStatusUpdate(myId, otherUserId, "connect");

    return res.status(201).json(new ApiResponse(201, {}, "connection remove successfully."))
})

export const getConnectionRequests = asyncHandler(async(req, res)=>{
    const userId = req.userId;
    const requests = await Connection.find({reciever : userId, status : "pending"}).populate("sender", "firstName lastName email userName profileImage headings");
    return res.status(200).json(new ApiResponse(200, requests, "All pending requests are fetched"))
})

export const getUserConnections = asyncHandler(async(req, res)=>{
    const userId = req.userId;
    const user = await User.findById(userId).select('-password').populate("connections", "firstName lastName userName profileImage headings connections");
    return res.status(200).json(new ApiResponse(200, user, "user connections fetched successfully"));
})
