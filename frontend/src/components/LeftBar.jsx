import React from 'react'
import { useUser } from '../context/userContext'
import { FaCamera } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import dp from '../assets/profile.png'
import { IoLocationSharp } from "react-icons/io5";

function LeftBar() {
    const {edit, setEdit, user, setUser} = useUser();
  return (
    <>
    <div className=" sticky top-25 hidden lg:block w-full lg:w-[25%] min-h-[250px] mt-4 neo bg-[var(--surface)] rounded-2xl overflow-hidden pb-5">
          <div className="relative">
            <div className="cover w-full h-[100px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] overflow-hidden">
              <img src={user.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="dp absolute left-1/2 -translate-x-1/2 top-[65px] w-[70px] h-[70px] rounded-full overflow-hidden border-4 border-[var(--surface)] bg-[var(--surface)] shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)]">
              <img src={user.profileImage.url} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-4 mt-10">
            <h2 className="user capitalize text-[var(--text)] font-semibold text-base">
              {user.firstName + " " + user.lastName}
            </h2>
            {user.headings && <p className="text-[var(--text-muted)] text-sm mt-1">{user.headings}</p>}
            <p className="location flex gap-1 items-center text-[var(--text-muted)] text-xs mt-1"><IoLocationSharp />{user.location}</p>
            <button
              onClick={() => setEdit(!edit)}
              className="gradient-btn w-[70%] flex items-center justify-center gap-2 text-white text-sm font-medium py-2 px-4 rounded-full mt-4 hover:opacity-90 active:scale-[0.98] transition"
            >
              Edit Profile
              <MdModeEdit />
            </button>
          </div>
        </div>
    </>
  )
}

export default LeftBar