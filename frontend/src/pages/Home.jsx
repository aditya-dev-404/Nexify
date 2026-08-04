import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../context/userContext';
import EditProfile from '../components/EditProfile';
import IconStrip from '../components/IconStrip';
import CenterHero from '../components/CenterHero';
import LeftBar from '../components/LeftBar';
import CreatePostForm from '../components/CreatePostForm';

function Home() {

  const { createPost, setCreatePost,edit, setEdit } = useUser();



  return (
    <>
      <div className="w-full min-h-[100vh] lg:pt-[100px] md:pt-[15px] sm:pt-[1px] flex flex-col lg:flex-row items-start gap-4 lg:gap-5 px-3 lg:px-4">
        {edit && <EditProfile />}
        {createPost && <CreatePostForm setCreateForm={setCreatePost}/>}
        <Navbar />

        {/* ---------- LEFT: Profile card — lg and up only ---------- */}
        <LeftBar/>

        {/* Icon strip — mobile & tablet only */}
        <IconStrip/>

        {/* ---------- CENTER: Hero ---------- */}
        <CenterHero/>

        {/* ---------- RIGHT: Full panel — lg and up only ---------- */}
        <div className="hidden lg:block w-full lg:w-[25%] min-h-[200px] mt-4 neo bg-[var(--surface)] rounded-2xl p-5">
          <h1 className="text-[var(--text)] font-semibold text-base mb-3">Right</h1>
        </div>
      </div>

      </>
      )
}

      export default Home