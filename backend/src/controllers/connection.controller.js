import asyncHandler from "../utils/async.handler.js";
import Connection from "../models/connection.model.js";
import ApiError from "../utils/api.error.js";
import ApiResponse from "../utils/api.response.js";
import User from "../models/user.model.js";
import {io, userSocketMap} from '../app.js'


export const sendConnectionRequest = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const senderId = req.userId;
    if( id === senderId){
        throw new ApiError(400, "Can't sent request to Yourself");
    }
    const sender = await User.findById(senderId);
    if(sender.connecions.some(connectionId => connectionId.toString() === id)){
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
    const recieverSocketId = userSocketMap.get(id);
    const senderSocketId = userSocketMap.get(senderId);
    if(recieverSocketId){
        io.to(recieverSocketId).emit("statusUpdate", {updatedUserId : senderId,  newStatus:"recieved" });
    }
    if(senderSocketId){
        io.to(senderSocketId).emit("statusUpdate", {updatedUserId : id, newStatus : "pending"});
    }

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
        $addToSet:{connecions:connection.sender}
    })
    await User.findByIdAndUpdate(connection.sender._id, {
        $addToSet:{connecions:connection.reciever}
    })

    const recieverSocketId = userSocketMap.get(connection.reciever._id.toString());
    const senderSocketId = userSocketMap.get(connection.sender._id.toString());
    if(recieverSocketId){
        io.to(recieverSocketId).emit("statusUpdate", {updatedUserId :connection.sender.toString() ,  newStatus:"connected" });
    }
    if(senderSocketId){
        io.to(senderSocketId).emit("statusUpdate", {updatedUserId : connection.reciever.toString(), newStatus : "connected"});
    }


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
    
    return res.status(201).json(new ApiResponse(201, {}, "connection request rejected."))
})

export const getConnectionStatus = asyncHandler(async(req, res)=>{
    const targetUserId = req.params.id;
    const currUserId = req.userId;

    const currentUser = await User.findById(currUserId)
    if(currentUser.connecions.some(connectionId => connectionId.toString() === targetUserId)){
        return res.status(200).json(new ApiResponse(200, {status:'connected'}, 'you are connected to each other.'));
    }
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
    return res.status(200).json(new ApiResponse(200, {status:"connect"}, "Send Connection Request"))
})

export const removeConnection = asyncHandler(async (req, res) => {
    const myId = req.userId;
    const otherUserId = req.params.id;
    await User.findByIdAndUpdate(myId, {$pull : {connecions : otherUserId}});
    await User.findByIdAndUpdate(otherUserId, {$pull : {connecions : myId }});
    await Connection.findOneAndDelete({
        $or: [
            { sender: myId, reciever: otherUserId },
            { sender: otherUserId, reciever: myId }
        ],
        status: 'accepted'
    });
    
    const recieverSocketId = userSocketMap.get(otherUserId);
    const senderSocketId = userSocketMap.get(myId);
    if(recieverSocketId){
        io.to(recieverSocketId).emit("statusUpdate", {updatedUserId : myId,  newStatus:"connect" });
    }
    if(senderSocketId){
        io.to(senderSocketId).emit("statusUpdate", {updatedUserId : otherUserId, newStatus : "connect"});
    }

    return res.status(201).json(new ApiResponse(201, {}, "connection remove successfully."))
})

export const getConnectionRequests = asyncHandler(async(req, res)=>{
    const userId = req.userId;
    const requests = await Connection.find({reciever : userId, status : "pending"}).populate("sender", "firstName lastName email userName profileImage headings");
    return res.status(200).json(new ApiResponse(200, requests, "All pending requests are fetched"))
})

export const getUserConnections = asyncHandler(async(req, res)=>{
    const userId = req.userId;
    const user = await User.findById(userId).populate("connection", "firstName lastName userName profileImage headline connections");
    return res.status(200).json(new ApiResponse(200, user, "user connections fetched successfully"));
})
