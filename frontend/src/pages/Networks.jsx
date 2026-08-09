import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/userAuth'
import { asyncHandler } from '../utils/async.handler';
import axios from 'axios';
import moment from 'moment';



function Networks() {
    const { baseUrl } = useAuth();
    const [connections, setConnections] = useState([]);
    useEffect(() => {
        const handleGetRequests = asyncHandler(async () => {
            const result = await axios.get(
                baseUrl + `/api/user/connection/getRequests`,
                { withCredentials: true }
            );
            setConnections(result.data.data);
            console.log(result.data.data);
        });

        handleGetRequests();
    }, [baseUrl]);

    const handleRequestAccept = asyncHandler(async (requestId) => {
        const result = await axios.put(
                baseUrl + `/api/user/connection/accept/${requestId}`,{},
                { withCredentials: true })
                setConnections(connections.filter((conn)=>conn._id == requestId));
    })

    const handleRequestReject = asyncHandler(async (requestId) => {
        const result = await axios.put(
                baseUrl + `/api/user/connection/reject/${requestId}`,{},
                { withCredentials: true })
            setConnections(connections.filter((conn)=>conn._id == requestId));
    })

    return (
        <>
            <div>
                <Navbar />
                <h4 className="conn-card text-[var(--text-muted)] p-4 m-6">{connections.length == 0 ? "No Pending Requests" : connections.length === 1 ? "1 Pending Request": connections.length + "Pending Requests"}</h4>
                <div className="flex flex-col items-center justify-center ">
                    {connections.map((connection) => (
    !connection.sender ? null : (
        <div
            key={connection._id}
            className="conn-card w-full md:max-w-[60%] neo rounded-2xl p-4 flex items-center justify-between gap-4"
        >
            <div className="post-header flex gap-4 items-center min-w-0">
                <div className="image h-[45px] w-[45px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                    <img
                        src={connection.sender.profileImage?.url }
                        alt={connection.sender.firstName}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="profile-info flex flex-col justify-center min-w-0">
                    <p className="user capitalize text-[var(--text)] font-medium text-sm sm:text-base truncate">
                        {connection.sender.firstName + " " + connection.sender.lastName}
                    </p>
                    <p className='text-xs sm:text-sm text-[var(--text-muted)] truncate'>
                        {connection.sender.headings}
                    </p>
                    <p className='text-xs text-[var(--text-muted)] truncate'>
                        {moment(connection.createdAt).fromNow()}
                    </p>
                </div>
            </div>

            <div className="actions flex gap-2 shrink-0">
                <button onClick={()=>handleRequestAccept(connection._id)} className="gradient-btn text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white font-medium">
                    Accept
                </button>
                <button onClick={()=>handleRequestReject(connection._id)} className="neo-inset text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[var(--text-muted)] font-medium">
                    Decline
                </button>
            </div>
        </div>
    )
))}
                </div>

            </div>
        </>
    )
}

export default Networks