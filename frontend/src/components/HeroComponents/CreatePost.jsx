import React from 'react'
import dp from '../../assets/profile.png'
import { useUser } from '../../context/userContext.js'

function CreatePost() {
    const { user, createPost, setCreatePost } = useUser();
    return (
        <div className="neo flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl">
            <div className="h-11 w-11 md:h-[60px] md:w-[60px] sm:h-[40px] sm:w-[40px] shrink-0 overflow-hidden rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                <img src={user.profileImage.url} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div onClick={()=>setCreatePost(true)} className="neo-inset flex-1 px-4 py-2.5 md:py-3 cursor-pointer">
                <h4 className="text-[var(--text-muted)] text-sm md:text-base">Create post...</h4>
            </div>
        </div>

    )
}

export default CreatePost