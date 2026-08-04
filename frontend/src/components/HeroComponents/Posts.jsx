import React from 'react'
import { useUser } from '../../context/userContext'
import PostCard from './PostCard';

function Posts() {
    const {posts} = useUser();


  return (
    <>
    <div className="flex flex-col w-full min-h-[100vh] neo mt-4 ">
        {posts.map((post, i)=> <PostCard key={i} postInfo = {post}/>)}
    </div>
    </>
  )
}

export default Posts