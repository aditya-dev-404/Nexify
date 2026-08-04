import React from 'react'
import CreatePost from './HeroComponents/CreatePost'
import CreatePostForm from './CreatePostForm'
import Posts from './HeroComponents/Posts'

function CenterHero() {
    return (
        <div className="w-full lg:w-[50%] flex-1 min-h-[100vh] mt-4 px-5">
            <CreatePost/>
            <Posts/>


        </div>
    )
}

export default CenterHero