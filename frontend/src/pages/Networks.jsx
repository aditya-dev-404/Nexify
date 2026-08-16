import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/userAuth'
import { asyncHandler } from '../utils/async.handler';
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';



function Networks() {
    const { baseUrl } = useAuth();
    const {user} = useUser();
    const [connections, setConnections] = useState([]);
    const [userConnections, setUserConnections] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const handleGetRequests = asyncHandler(async () => {
            const result = await axios.get(
                baseUrl + `/api/user/connection/getRequests`,
                { withCredentials: true }
            );
            setConnections(result.data.data);
        });
        handleGetRequests();
    }, [baseUrl]);
    useEffect(() => {
        const handleGetConnections = asyncHandler(async () => {
            const result = await axios.get(
                baseUrl + `/api/user/connection/getConnections`,
                { withCredentials: true }
            );
            setUserConnections(result.data.data.connections)
        });
        handleGetConnections();
    }, [baseUrl]);

    const handleRequestAccept = asyncHandler(async (requestId) => {
        const acceptedRequest = connections.find((connection) => connection._id === requestId);
        const result = await axios.put(
            baseUrl + `/api/user/connection/accept/${requestId}`, {},
            { withCredentials: true })
        setConnections((currentConnections) => currentConnections.filter((conn) => conn._id !== requestId));
        setUserConnections((currentConnections) => {
            if (!acceptedRequest?.sender || currentConnections.some((connection) => connection._id === acceptedRequest.sender._id)) {
                return currentConnections;
            }

            return [...currentConnections, acceptedRequest.sender];
        });

    })

    const handleRequestReject = asyncHandler(async (requestId) => {
        const result = await axios.put(
            baseUrl + `/api/user/connection/reject/${requestId}`, {},
            { withCredentials: true })
        setConnections((currentConnections) => currentConnections.filter((conn) => conn._id !== requestId));
    })
    const handleDisconnect = asyncHandler(async (requestId)=>{
        const result = await axios.delete(baseUrl + `/api/user/connection/remove/${requestId}`,{ withCredentials: true });
        setUserConnections(connections.filter((conn)=> conn._id !== requestId));
    })

    return (
   <>
    <div className="bg-[var(--bg)] min-h-screen">
        <Navbar />

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 pb-16">

            {/* Pending Requests Section */}
            <div className="flex flex-col items-center gap-3 mt-6">
                <h4 className="w-full text-[var(--text)] text-base sm:text-lg font-semibold px-6 py-4 neo rounded-2xl">
                    Connection Requests
                </h4>

                <h6 className="text-[var(--text-muted)] text-sm italic self-start px-2">
                    {connections.length == 0
                        ? "No Pending Requests.."
                        : connections.length === 1
                        ? "1 Pending Request"
                        : connections.length + " Pending Requests"}
                </h6>

                <div className="w-full flex flex-col gap-3">
                    {connections.map((connection) => (
                        !connection.sender ? null : (
                            <div
                                key={connection._id}
                                className="conn-card w-full neo rounded-2xl p-4 flex items-center justify-between gap-4"
                            >
                                <div className="post-header flex gap-4 items-center min-w-0">
                                    <div className="image h-[45px] w-[45px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                                        <img
                                            src={connection.sender.profileImage?.url}
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
                                    <button onClick={() => handleRequestAccept(connection._id)} className="gradient-btn text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-medium hover:opacity-90 active:scale-[0.98] transition">
                                        Accept
                                    </button>
                                    <button onClick={() => handleRequestReject(connection._id)} className="neo-inset text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[var(--danger)] font-medium hover:opacity-80 active:scale-[0.98] transition">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* My Connections Section */}
            <div className="flex flex-col items-center gap-3 mt-10">
                <h4 className="w-full text-[var(--text)] text-base sm:text-lg font-semibold px-6 py-4 neo rounded-2xl">
                    My Connections
                </h4>

                <h6 className="text-[var(--text-muted)] text-sm italic self-start px-2">
                    {userConnections.length == 0
                        ? "No Connections..."
                        : userConnections.length === 1
                        ? "1 Connection"
                        : userConnections.length + " Connections"}
                </h6>

                <div className="w-full flex flex-col gap-3">
                    {userConnections.map((connection) => (
                        !connection ? null : (
                            <div
                                key={connection._id}
                                className="conn-card w-full neo rounded-2xl p-4 flex items-center justify-between gap-4"
                            >
                                <div className="post-header flex gap-4 items-center min-w-0">
                                    <div onClick={()=>navigate(`/profile/${connection.userName}`)} className="image h-[45px] w-[45px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                                        <img
                                            src={connection.profileImage?.url}
                                            alt={connection.firstName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="profile-info flex flex-col justify-center min-w-0">
                                        <p className="user capitalize text-[var(--text)] font-medium text-sm sm:text-base truncate">
                                            {connection.firstName + " " + connection.lastName}
                                        </p>
                                        <p className='text-xs sm:text-sm text-[var(--text-muted)] truncate'>
                                            {connection.headings}
                                        </p>
                                    </div>
                                </div>

                                <div className="actions flex gap-2 shrink-0">
                                    <button onClick={()=>handleDisconnect(connection._id)} className="neo-inset text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[var(--danger)] font-medium hover:opacity-80 active:scale-[0.98] transition">
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

        </div>
    </div>
</>

    )
}

export default Networks
