import React from 'react'
import dp from '../assets/profile.png'
import { useUser } from '../context/userContext'
import { MdModeEdit } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

function IconStrip() {
  const { user, setUser, edit, setEdit } = useUser();

  return (
    <>
      <div className="lg:hidden flex items-center gap-3 w-full neo bg-[var(--surface)] rounded-2xl p-3">
        <img
          src={user.profileImage.url}
          alt="Profile"
          className="w-[42px] h-[42px] rounded-full object-cover shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]"
        />
        <div className="flex-1 min-w-0">
          <p className="user capitalize text-[var(--text)] font-medium text-sm truncate">
            {user.firstName + " " + user.lastName}
          </p>
          <p className="flex gap-1 items-center text-[var(--text-muted)] text-xs truncate"><IoLocationSharp />{user.location}</p>
        </div>
        <button
          onClick={() => setEdit(!edit)}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-[var(--surface)] shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center justify-center transition"
        >
          <MdModeEdit size={16} />
        </button>
      </div>
    </>
  )
}

export default IconStrip