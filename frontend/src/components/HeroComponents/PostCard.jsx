import React, { useEffect, useState } from 'react'
import ImagesCarousel from '../ImagesCarousel'
import { AiFillLike } from "react-icons/ai";
import { FaComments } from "react-icons/fa6";
import moment from 'moment'
import { asyncHandler } from '../../utils/async.handler';
import axios from 'axios';
import { useAuth } from '../../context/userAuth';
import { useUser } from '../../context/userContext';
import defaultProfileImage from '../../assets/profile.png';
import {io} from 'socket.io-client'
import ConnectionButton from '../ConnectionButton';
import { useNavigate } from 'react-router-dom';

const socket = io('https://nexify-backend-ar99.onrender.com')


function PostCard({ postInfo }) {
    const { baseUrl } = useAuth();
    const { user } = useUser();
    const [likes, setLikes] = useState(postInfo.likes);
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(postInfo.likes.includes(user?._id));
    const [openCommentBox, setOpenCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(postInfo.comments);
    const navigate = useNavigate();

    const isLong = postInfo.description.length > 150;
    const handleLike = asyncHandler(async (e) => {
        const result = await axios.get(baseUrl + `/api/user/post/like/${postInfo._id}`, {
            withCredentials: true
        })
        setLiked(result.data.data.likes.includes(user?._id));
    })
    const handleProfileRedirect = (userName)=>{
        navigate(`/profile/${userName}`)
    }
    useEffect(() => {
        const handleLikeUpdated = ({ postId, likes: updatedLikes }) => {
            if (postId === postInfo._id) {
                setLikes(updatedLikes);
                setLiked(updatedLikes.includes(user?._id));
            }
        };
        const handleCommentUpdate = ({postId, comm})=>{
            if(postId === postInfo._id){
                setComments(comm);
            }
        }
        socket.on("likeUpdated", handleLikeUpdated);
        socket.on("commentAdded", handleCommentUpdate)

        return () =>{
            socket.off("likeUpdated", handleLikeUpdated);
            socket.off("commentAdded", handleCommentUpdate);
        } 
    }, [postInfo._id, user?._id]);



    const handleAddComment = asyncHandler(async (e) => {
        e.preventDefault();
        if (!comment || !comment.trim()) return;
        const paylod = { 'content': comment }
        const result = await axios.post(baseUrl + `/api/user/post/comment/${postInfo._id}`, paylod, { withCredentials: true });
        setComments(result.data.data.comments);
        setComment("");
        setOpenCommentBox(true);
    })
    return (
        <>
            <div className="post-card neo p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-4">
                <div className="post-header flex gap-4">
                    <div onClick={()=>handleProfileRedirect(postInfo.author.userName)} className="image h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                        <img src={postInfo.author.profileImage.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="profile-info flex flex-col justify-center w-[70%]">
                        <p className="user capitalize text-[var(--text)] font-medium text-sm sm:text-base truncate">{postInfo.author.firstName + " " + postInfo.author.lastName}</p>
                        <p className='text-xs sm:text-sm text-[var(--text-muted)] truncate'>{postInfo.author.headings}</p>
                        <p className='text-xs text-[var(--text-muted)] truncate'>{moment(postInfo.createdAt).fromNow()}</p>
                    </div>
                       {user._id !== postInfo.author._id && <ConnectionButton userId = {postInfo.author._id}/>}
                    
                </div>

                <div className="post-description text-[var(--text)] text-sm sm:text-base leading-relaxed">
                    <p className={expanded ? '' : 'line-clamp-3'}>
                        {postInfo.description}
                    </p>

                    {isLong && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-[var(--secondary)] text-sm text-bold font-medium mt-1 hover:opacity-[0.6] "
                        >
                            {expanded ? 'Show less' : 'Read more..'}
                        </button>
                    )}
                </div>

                <div className="post-images rounded-2xl overflow-hidden md:px-10 lg:px-16">
                    <ImagesCarousel images={postInfo.images} />
                </div>

                <div className="like-comment-iconbox flex items-center justify-between gap-6 border-y border-[var(--border)] py-5 px-8">
                    <div onClick={handleLike} className={`like flex items-center gap-2 ${liked ? "text-[var(--primary)]" : "text-[var(--text-muted)]"} cursor-pointer transition text-sm sm:text-base`}>
                        <AiFillLike size={25} /> <p>{likes.length}</p>
                    </div>
                    <div onClick={() => setOpenCommentBox(!openCommentBox)} className="comment flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition text-sm sm:text-base">
                        <FaComments size={25} /> <p>{comments.length}</p>
                    </div>
                </div>

                <div className="comments flex flex-col gap-4 border-t border-[var(--border)] pt-3">
                    <form onSubmit={handleAddComment} className='neo-inset flex items-center justify-between gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full'>
                        <input
                            type="text"
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            placeholder='Add a comment....'
                            className='flex-1 bg-transparent outline-none text-sm text-[var(--text)] placeholder-[var(--text-muted)]'
                        />
                        <button
                            type='submit'
                            className='gradient-btn text-white text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full hover:opacity-90 active:scale-[0.98] transition shrink-0'
                        >
                            Comment
                        </button>
                    </form>

                    {openCommentBox && (<div className="all-cmments flex flex-col-reverse gap-3 max-h-[200px] overflow-scroll no-scrollbar">
                        {comments?.length > 0 ? (
                            comments.map((comm, i) => (
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
                                            {comm.user?.firstName+" "+comm.user?.lastName || "Anonymous"}
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
            </div>
        </>
    )
}

export default PostCard
