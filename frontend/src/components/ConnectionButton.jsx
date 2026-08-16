import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/userAuth'
import axios from 'axios';
import { asyncHandler } from '../utils/async.handler';
import { io } from 'socket.io-client';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
const socket = io("https://nexify-backend-ar99.onrender.com")

function ConnectionButton({userId}) {
    const {baseUrl} = useAuth();
    const {user} = useUser();
    const [status, setStatus] = useState("");
    const navigate = useNavigate();


    const handleSendConnection = asyncHandler( async()=>{
        const result = await axios.post(`${baseUrl}/api/user/connection/send/${userId}`,{}, {withCredentials:true});
        setStatus("pending");
    })
    const handleRemoveConnection = asyncHandler( async()=>{
        const result = await axios.delete(`${baseUrl}/api/user/connection/remove/${userId}`, {withCredentials:true});
        setStatus("connect");
    })
    const getConnectionStatus = useCallback(async () => {
        const result = await axios.get(`${baseUrl}/api/user/connection/getStatus/${userId}`, {withCredentials:true});
        setStatus(result.data.data.status)
    }, [baseUrl, userId])

    useEffect(()=>{
        if (user?._id) socket.emit("register", user._id)
        asyncHandler(getConnectionStatus)()

        const handleStatusUpdate = ({updatedUserId, newStatus}) => {
            if(String(updatedUserId) === String(userId)){
                setStatus(newStatus);
            }
        };

        socket.on("statusUpdate", handleStatusUpdate)

        return ()=>{
            socket.off("statusUpdate", handleStatusUpdate)
        }

    },[userId, user?._id, getConnectionStatus])

    const handleClick = asyncHandler(async(e)=>{
        if(status === "connected"){
            await handleRemoveConnection();
        }else if(status === 'recieved'){
            navigate('/networks')
        }else{
            await handleSendConnection();
        }
    })


  return (
    <>
        <div className="connection">
            <button disabled={status === 'pending'} onClick={handleClick} className="gradient-btn min-w-[10%] whitespace-nowrap rounded-full text-[var(--surface)] py-1 px-4 hover:opacity-90 active:scale-[0.90] transition mt-2">
                {status === "pending" ? "Pending" : status === "recieved" ? "View request" : status === "connected" ? "Disconnect" : "Connect"}
            </button>
        </div>
    </>
  )
}

export default ConnectionButton 
