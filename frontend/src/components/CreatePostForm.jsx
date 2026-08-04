import React, { useRef, useState } from 'react'
import { ImCross } from "react-icons/im";
import { useUser } from '../context/userContext.js';
import { FaImage } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { asyncHandler } from '../utils/async.handler.js';
import axios from 'axios';
import { useAuth } from '../context/userAuth.js';
import { useNavigate } from 'react-router-dom';

function CreatePostForm({ setCreateForm }) {
    const { user, createPost, setCreatePost } = useUser()
    const {baseUrl} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [postImages, setPostImages] = useState([]);
    const [postImagesPrev, setPostImagesPrev] = useState([]);
    const postImageRef = useRef(null);
    const navigate = useNavigate();

    const handleImgChange = (e) => {
        const selected = Array.from(e.target.files); // convert FileList to array

        if (selected.length > 4) {
            toast.error("You can select only upto 4 images.");
            return;
        }

        setPostImages(selected);
        setPostImagesPrev(selected.map((file) => URL.createObjectURL(file)));
    }

    const handlePostSubmit = asyncHandler(async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        postImages.forEach((file)=>{
            formData.append('postImage', file);
        })
        const result = await axios.post(baseUrl + '/api/user/post/create',formData, {withCredentials:true});
        setCreatePost(false);
        navigate("/");
    }, setIsLoading)

    return (
        <>
            <div className="w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center overflow-y-auto">

                <div className="w-full h-full bg-[var(--text)] opacity-[0.6] absolute"></div>

                <div className="neo w-[90%] max-w-[500px] min-w-[400px] min-h-[60%] bg-[var(--surface)] absolute z-[200] p-4 sm:p-[40px] overflow-auto">

                    <div
                        onClick={() => setCreatePost(false)}
                        className="w-8 h-8 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] sticky left-[100%] cursor-pointer transition z-[201] mb-4"
                    >
                        <ImCross size={14} />
                    </div>

                    <div className="neo flex items-center gap-3 px-4 py-1 md:px-6 md:py-1 rounded-2xl">
                        <div className="hidden sm:block h-10 w-10 md:h-[60px] md:w-[60px] shrink-0 overflow-hidden rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                            <img src={user.profileImage.url} alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <h4 className="text-[var(--text)] text-xl md:text-base px-4 py-2.5 md:py-3 capitalize">{user.firstName + " " + user.lastName}</h4>
                    </div>

                    <form onSubmit={handlePostSubmit} className="neo px-2 mb-2 md:px-4 md:py-4 rounded-2xl h-full mt-6 flex flex-col">
                        <textarea
                            onChange={(e)=>setDescription(e.target.value)}
                            name="description"
                            id="description"
                            placeholder='Write your post...'
                            className='w-full py-3 bg-transparent text-[var(--text)] placeholder-[var(--text-muted)] text-sm md:text-base resize-none outline-none min-h-[120px]'
                        ></textarea>

                        <input type="file" onChange={handleImgChange} ref={postImageRef} className='hidden' accept='image/*' multiple />
                        {postImagesPrev.length > 0  && <div className="flex w-fit gap-1 h-[100px] w-auto my-2 p-1 neo-inset overflow-hidden">
                            {postImagesPrev.map((src, i) => (
                                <img key={i} src={src} alt='post img' className='h-full rounded-lg w-[100px]' />
                            ))}
                        </div>}

                        <div onClick={() => postImageRef.current.click()} className="image w-9 h-9 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer transition active:scale-[0.96]">
                            <FaImage />
                        </div>

                        <div className="w-full h-[1px] bg-[var(--border)] my-4"></div>

                        <div className="flex justify-center sm:pb-4 pb-6">
                            <button type='submit' className="gradient-btn w-[40%] flex items-center justify-center self-center text-white text-sm font-medium py-2 rounded-full hover:opacity-90 active:scale-[0.98] transition">{isLoading ? "Posting..." : "Post"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreatePostForm