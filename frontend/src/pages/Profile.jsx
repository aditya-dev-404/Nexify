import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../context/userContext'
import dp from '../assets/profile.png'
import cover from '../assets/image.png'
import ImagesCarousel from '../components/ImagesCarousel.jsx'
import moment from 'moment'
import EditProfile from '../components/EditProfile'
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom'
import { asyncHandler } from '../utils/async.handler';
import ConnectionButton from '../components/ConnectionButton.jsx'
import defaultProfileImage from '../assets/profile.png'

function Profile() {
    const { user, posts, edit, setEdit, getUserDetails, profileData, setProfileData } = useUser();
    const [expandedPostId, setExpandedPostId] = useState(null);
    const { userName } = useParams();
    const navigate = useNavigate();
    const isOwnProfile = !userName || userName === user?.userName;
    const [openComments, setOpenComments] = useState(false);
    useEffect(() => {
        if (!user) return;

        if (isOwnProfile) {
            setProfileData(user);
        } else {
            asyncHandler(getUserDetails)(userName);
        }
    }, [user, userName, isOwnProfile, getUserDetails, setProfileData])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [userName]);
    if (!profileData) {
        return (
            <>
                <Navbar />
                <div className="main bg-[var(--bg)] min-h-screen" />
            </>
        );
    }

    const profileConnections = profileData.connections || [];
    const profilePosts = posts.filter((post) => String(post.author?._id) === String(profileData._id));

    return (
        <>
            {isOwnProfile && edit && <EditProfile />}
            <Navbar />
            <div className="main bg-[var(--bg)] min-h-screen pb-10">

                <div className="info-holder max-w-[700px] mx-auto px-4 sm:px-0 flex flex-col gap-4 mb-6 no-scrollbar">

                    {/* Cover image and Profile image */}
                    <div className="images relative">
                        <div className="coverImage neo w-full h-[140px] sm:h-[220px] rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                            <img src={profileData.coverImage?.url || cover} alt="cover image" className="w-full h-full object-cover" />
                        </div>
                        <div className="profileImage absolute left-6 sm:left-10 -bottom-10 sm:-bottom-14 h-20 w-20 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-[var(--surface)] shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                            <img src={profileData.profileImage?.url || dp} alt="profile image" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Name and basic information */}
                    <div className="name-in-center neo rounded-2xl px-6 sm:px-10 pt-12 sm:pt-16 pb-6 flex flex-col gap-1">
                        <h4 className="text-[var(--text)] text-lg sm:text-2xl font-semibold capitalize">{profileData.firstName + " " + profileData.lastName}</h4>
                        <p onClick={isOwnProfile ? () => navigate('/networks') : undefined} className={`text-[var(--text-muted)] capitalize !text-[12px] sm:text-base ${isOwnProfile ? 'cursor-pointer' : ''}`}>{profileConnections.length === 0 ? "no connections yet" : profileConnections.length === 1 ? "1 Connection" : profileConnections.length + " Connections"}</p>
                        <p className="flex gap-2 items-center text-[var(--text-muted)] capitalize !text-[14px] sm:text-base">{profileData.location} <IoLocationSharp /></p>
                        <p className="text-[var(--text-muted)] text-sm sm:text-base">{profileData.headings}</p>
                        <div className="w-full h-[1px] bg-[var(--border)] mt-2"></div>
                        {profileData.skills?.length > 0 && (
                            <div className="skills flex flex-wrap gap-2 mt-3">
                                <p className="w-full text-[var(--text-muted)] text-xs sm:text-base">Skills : </p>
                                {profileData.skills.map((skill, index) => (
                                    <h5 key={index} className="neo capitalize text-[var(--text)] text-xs sm:text-sm font-medium px-3 py-1 !rounded-sm">
                                        {skill}
                                    </h5>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Education and qualifications */}
                    {profileData.education?.length > 0 && (
                        <div className="education neo rounded-2xl px-6 sm:px-8 py-5 flex flex-col gap-4">
                            <h3 className="text-[var(--text)] text-base sm:text-lg font-semibold">Education</h3>
                            {profileData.education.map((edu, index) => (
                                <div key={index} className="flex flex-col gap-0.5 border-l-2 border-[var(--border)] pl-4">
                                    <h4 className="text-[var(--text)] text-sm sm:text-base font-medium">{edu.college}</h4>
                                    <h5 className="text-[var(--text-muted)] text-xs sm:text-sm">{edu.degree}</h5>
                                    <h5 className="text-[var(--text-muted)] text-xs sm:text-sm">{edu.fieldOfStudy}</h5>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Experience if any */}
                    {profileData.exprience?.length > 0 && (
                        <div className="exprience neo rounded-2xl px-6 sm:px-8 py-5 flex flex-col gap-4">
                            <h3 className="text-[var(--text)] text-base sm:text-lg font-semibold">Experience</h3>
                            {profileData.exprience.map((exp, index) => (
                                <div key={index} className="flex flex-col gap-0.5 border-l-2 border-[var(--border)] pl-4">
                                    <h4 className="text-[var(--text)] text-sm sm:text-base font-medium">{exp.title}</h4>
                                    <h5 className="text-[var(--text-muted)] text-xs sm:text-sm">{exp.company}</h5>
                                    <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {isOwnProfile ? (<div className="edit mt-5 flex justify-center">
                        <button onClick={() => setEdit(!edit)} className="gradient-btn text-white min-w-[40%] text-sm font-medium px-6 py-2 rounded-full hover:opacity-90 active:scale-[0.98] transition">
                            Edit Profile
                        </button>
                    </div>) : (<div className="edit mt-5 flex justify-center">
                        <ConnectionButton userId={profileData._id} />
                    </div>)}
                    <div className="w-full h-[2px] bg-[var(--border)] m-5"></div>
                    {/* Posts */}
                    <div className="userPosts flex flex-col gap-4 mt-2">
                        <h4 className='p-4 text-[var(--text-muted)]'>{isOwnProfile ? 'All Your Posts...' : `${profileData.firstName}'s Posts`}</h4>
                        {profilePosts
                            .map((post) => (
                                <div key={post._id} className="post-card neo p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-4">
                                    <div className="post-header flex gap-4">
                                        <div className="image h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                                            <img src={post.author.profileImage?.url || dp} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="profile-info flex flex-col justify-center w-[70%]">
                                            <p className="user capitalize text-[var(--text)] font-medium text-sm sm:text-base truncate">{post.author.firstName + " " + post.author.lastName}</p>
                                            <p className='text-xs sm:text-sm text-[var(--text-muted)] truncate'>{post.author.headings}</p>
                                            <p className='text-xs text-[var(--text-muted)] truncate'>{moment(post.createdAt).fromNow()}</p>
                                        </div>
                                    </div>

                                    <div className="post-description text-[var(--text)] text-sm sm:text-base leading-relaxed">
                                        <p className={expandedPostId === post._id ? '' : 'line-clamp-3'}>
                                            {post.description}
                                        </p>

                                        {post.description.length > 150 && (
                                            <button
                                                onClick={() => setExpandedPostId((currentPostId) => currentPostId === post._id ? null : post._id)}
                                                className="text-[var(--secondary)] text-sm font-medium mt-1 hover:opacity-[0.6] transition"
                                            >
                                                {expandedPostId === post._id ? 'Show less' : 'Read more..'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="post-images rounded-2xl overflow-hidden md:px-10 lg:px-16">
                                        <ImagesCarousel images={post.images} />
                                    </div>

                                    <div className="flex items-center justify-between gap-6 border-y border-[var(--border)] py-3 px-4 sm:px-8">
                                        <div className="like flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition text-sm sm:text-base">
                                            <p className='text-[var(--text-muted)] capitalize !text-[12px] sm:text-base italic'>{post.likes?.length || 0} Likes</p>
                                        </div>
                                        <div onClick={()=>setOpenComments(!openComments)} className="comment flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition text-sm sm:text-base">
                                            <p className='text-[var(--text-muted)] capitalize !text-[12px] sm:text-base italic'>{post.comments?.length || 0} Comments</p>
                                        </div>
                                    </div>
                                    {openComments && (<div className="all-cmments flex flex-col-reverse gap-3 max-h-[200px] overflow-scroll no-scrollbar">
                                        {post.comments?.length > 0 ? (
                                            post.comments.map((comm, i) => (
                                                <div key={comm._id || i} className="flex gap-3 sm:gap-4">
                                                    <div className="image h-[26px] w-[26px] sm:h-[40px] sm:w-[40px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                                                        <img
                                                            src={comm.user?.profileImage?.url || defaultProfileImage}
                                                            alt={comm.user?.name || "User Profile"}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="profile-info neo-inset flex flex-col justify-center w-full px-3 py-2 rounded-2xl">
                                                        <span className="text-sm sm:text-xs font-bold text-[var(--text-muted)] mb-0.5 capitalize">
                                                            {comm.user?.firstName + " " + comm.user?.lastName || "Anonymous"}
                                                        </span>
                                                        <p className="text-xs sm:text-sm text-[var(--text)] break-words">
                                                            {comm.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs sm:text-sm text-[var(--text-muted)] ">No comments yet.</p>
                                        )}
                                    </div>)}
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>

        </>
    )
}

export default Profile
