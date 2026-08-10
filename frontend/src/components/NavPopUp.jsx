import React from 'react'
import { useUser } from '../context/userContext'
import profile from '../assets/profile.png'
import { IoPeople } from "react-icons/io5";
import { useAuth } from '../context/userAuth.js';
import { asyncHandler } from '../utils/async.handler.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function NavPopUp({profileClick}) {
    const {user, setUser} = useUser();
    const {baseUrl} = useAuth();
    const navigate = useNavigate();
    const handleSignout = asyncHandler(async ()=> {
        await axios.get(baseUrl + '/api/auth/logout', {withCredentials:true});
        setUser(null);
        navigate('/login');
        toast.success('Logged out')
    })
    const handleNav = ()=>{
      profileClick(false)
      navigate('/profile')
    }
  return (
    <>
    <div className="profile-info absolute top-[95px] right-0 w-[260px] neo bg-[var(--surface)] p-5 z-50 flex flex-col">

  {/* Profile summary */}
  <div
    className="profile cursor-pointer flex flex-col items-center mb-3"
  >
    <img
      src={user.profileImage.url}
      alt="dp"
      className='h-[60px] w-[60px] rounded-full object-cover shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]'
    />
    <p className='text-[var(--text)] font-medium my-2 capitalize text-center'>
      {user.firstName + " " + user.lastName}
    </p>
  </div>

  {/* View profile button */}
  <button onClick={handleNav} className='gradient-btn text-white text-sm font-medium py-2 rounded-full mb-4 hover:opacity-90 active:scale-[0.98] transition'>
    View Profile
  </button>

  <div className="w-full h-[1px] bg-[var(--border)] mb-3"></div>

  {/* My Networks row */}
  <div onClick={()=>navigate('/networks')} className="networks flex items-center justify-between py-2 px-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-light)] cursor-pointer transition mb-2">
    <span className="text-sm">My Networks</span>
    <IoPeople className="text-lg" />
  </div>

  <div className="w-full h-[1px] bg-[var(--border)] mb-3"></div>

  {/* Sign out */}
  <button onClick={handleSignout} className='neo-inset text-sm text-[var(--danger)] font-medium py-2 rounded-full hover:opacity-80 active:scale-[0.98] transition'>
    Sign Out
  </button>

</div>
    </>
  )
}

export default NavPopUp 