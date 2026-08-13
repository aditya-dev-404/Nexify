import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../context/userContext';
import EditProfile from '../components/EditProfile';
import IconStrip from '../components/IconStrip';
import CenterHero from '../components/CenterHero';
import LeftBar from '../components/LeftBar';
import CreatePostForm from '../components/CreatePostForm';
import { asyncHandler } from '../utils/async.handler';
import axios from 'axios';
import { useAuth } from '../context/userAuth';
import { MdNavigateNext } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Home() {

  const { baseUrl } = useAuth();
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const { createPost, setCreatePost, edit, setEdit } = useUser();
  useEffect(() => {
    // Guard clause: stop if user hasn't loaded yet
    if (!user?._id) return;

    const suggestUsers = async () => {
      try {
        const sugg = await axios.get(`${baseUrl}/api/user/suggestedusers`, {
          withCredentials: true,
        });
        setSuggestions(sugg.data.data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    suggestUsers();
  }, [baseUrl, user?._id]);


  return (
    <>
      <div className="w-full min-h-[100vh] lg:pt-[100px] md:pt-[15px] sm:pt-[1px] flex flex-col lg:flex-row items-start gap-4 lg:gap-5 px-3 lg:px-4 ">
        {edit && <EditProfile />}
        {createPost && <CreatePostForm setCreateForm={setCreatePost} />}
        <Navbar />

        {/* ---------- LEFT: Profile card — lg and up only ---------- */}
        <LeftBar />

        {/* Icon strip — mobile & tablet only */}
        <IconStrip />

        {/* ---------- CENTER: Hero ---------- */}
        <CenterHero />

        {/* ---------- RIGHT: Full panel — lg and up only ---------- */}
        <div className="sticky top-25 hidden lg:flex flex-col gap-3 w-full lg:w-[25%] mt-4 neo bg-[var(--surface)] rounded-2xl p-5 max-h-[60vh] no-scrollbar overflow-scroll">
          {suggestions.length !== 0 && (
            <h5 className="text-[var(--text)] text-sm font-semibold px-1">Suggestions...</h5>
          )}
          {suggestions.length !== 0 ? suggestions.map((s) => (
            <div key={s._id} className="neo-inset flex items-center justify-between gap-3 px-4 py-3 rounded-2xl">
              <div className="post-header flex gap-3 items-center min-w-0">
                <div className="image h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden shrink-0 shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                  <img src={s.profileImage?.url} alt={s.firstName} className="h-full w-full object-cover" />
                </div>
                <div className="profile-info flex flex-col justify-center min-w-0">
                  <p className="user capitalize text-[var(--text)] font-medium text-xs sm:text-sm truncate">
                    {s.firstName + " " + s.lastName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate">
                    {s.headings}
                  </p>
                </div>
              </div>
              <button onClick={()=>navigate(`/profile/${s.userName}`)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--primary)] hover:opacity-80 active:scale-[0.96] transition">
                <MdNavigateNext size={12} />
              </button>
            </div>
          )) : (
            <p className="text-[var(--text-muted)] text-xs sm:text-sm text-center py-2">No Suggestions...</p>
          )}
        </div>
      </div>

    </>
  )
}

export default Home