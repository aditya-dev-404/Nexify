import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { asyncHandler } from '../utils/async.handler';
import { useAuth } from '../context/userAuth';
import axios from 'axios';
import { GiCancel } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const [notifications, setNotfications] = useState([]);
    const { baseUrl } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGetNotifications = asyncHandler(async () => {
            const result = await axios.get(`${baseUrl}/api/notification/get`, { withCredentials: true })
            setNotfications(result.data.data);
        })
        handleGetNotifications();
    }, [notifications, baseUrl])

    const handleDeleteNotification = asyncHandler(async (id) => {
        await axios.delete(`${baseUrl}/api/notification/deleteOne/${id}`,{withCredentials:true});
        setNotfications(notifications.filter((noti)=>noti._id != id));
    })
    const handleDeleteNotifications = asyncHandler(async () => {
        await axios.delete(`${baseUrl}/api/notification/delete`,{withCredentials:true})
        setNotfications([]);
    })
    return (
        <>
            <div className="">
                <Navbar />
                <div className="flex flex-col items-center gap-3 mt-10">

                    <h6 className="text-[var(--text-muted)] text-sm italic self-start px-2">
                        {notifications.length == 0
                            ? "No Notifications..."
                            : notifications.length === 1
                                ? "1 Notification"
                                : notifications.length + " Notifications"}
                    </h6>

                    <div className="w-full flex flex-col gap-3">
                        {notifications.length !== 0 && <button onClick={handleDeleteNotifications} className="neo-inset self-center w-[200px] text-xs sm:text-sm px-4 py-2 mb-4 !rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] font-medium active:scale-[0.98] transition">
                            Clear All
                        </button>}
                        {notifications.map((notification) => (
                            !notification ? null : (
                                <div
                                    key={notification._id}
                                    className="w-full neo rounded-2xl p-3 flex items-center justify-between gap-3"
                                >
                                    <div className="flex gap-3 sm:gap-4 items-center min-w-0 flex-1">
                                        <div className="image h-[45px] w-[45px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                                            <img
                                                src={notification.relatedUser.profileImage?.url}
                                                alt={notification.relatedUser.firstName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="notification-content min-w-0 flex-1">
                                            {notification.type === "like" &&
                                                <div
                                                    onClick={() => navigate(`/profile/${notification.relatedUser.userName}`)}
                                                    className="flex items-center justify-between gap-3 cursor-pointer min-w-0"
                                                >
                                                    <p className="text-xs sm:text-sm text-[var(--text)] min-w-0 truncate">
                                                        <span className="capitalize font-medium">
                                                            {notification.relatedUser.firstName + " " + notification.relatedUser.lastName}
                                                        </span>
                                                        <span className="text-[var(--text-muted)]"> liked your post</span>
                                                    </p>
                                                    {notification.relatedPost.images.length > 0 && 
                                                        <img
                                                        src={notification.relatedPost.images[0].url}
                                                        alt="Post"
                                                        className="h-9 w-9 rounded-lg object-cover shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]"
                                                    />}
                                                </div>
                                            }
                                            {notification.type === "comment" &&
                                                <div
                                                    onClick={() => navigate(`/profile/${notification.relatedUser.userName}`)}
                                                    className="flex items-center justify-between gap-3 cursor-pointer min-w-0"
                                                >
                                                    <p className="text-xs sm:text-sm text-[var(--text)] min-w-0 truncate">
                                                        <span className="capitalize font-medium">
                                                            {notification.relatedUser.firstName + " " + notification.relatedUser.lastName}
                                                        </span>
                                                        <span className="text-[var(--text-muted)]"> commented on your post</span>
                                                    </p>
                                                    {notification.relatedPost.imageslength > 0 && <img
                                                        src={notification.relatedPost.images[0].url}
                                                        alt="Post"
                                                        className="h-9 w-9 rounded-lg object-cover shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]"
                                                    />}
                                                </div>
                                            }
                                            {notification.type === "connect" &&
                                                <div
                                                    onClick={() => navigate('/networks')}
                                                    className="cursor-pointer min-w-0"
                                                >
                                                    <p className="text-xs sm:text-sm text-[var(--text)] truncate">
                                                        <span className="capitalize font-medium">
                                                            {notification.relatedUser.firstName + " " + notification.relatedUser.lastName}
                                                        </span>
                                                        <span className="text-[var(--text-muted)]"> sent you a connection request</span>
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <div className="actions flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleDeleteNotification(notification._id)}
                                            className="neo-inset w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] active:scale-[0.98] transition"
                                        >
                                            <GiCancel className="text-sm sm:text-base" />
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Notifications