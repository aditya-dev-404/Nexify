import { useState, useEffect, useCallback } from "react";
import axios from 'axios'
import { UserContext } from "./userContext.js";
import { useAuth } from "./userAuth.js";
import { asyncHandler } from "../utils/async.handler.js";


export const UserProvider = ({ children }) => {
    const { baseUrl } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [createPost, setCreatePost] = useState(false);
    const [profileData, setProfileData] = useState(null);


    const fetchUserRaw = useCallback(async () => {
        try {
            const res = await axios.get(baseUrl + '/api/user', { withCredentials: true });
            setUser(res.data.data);
        } catch (error) {
            setUser(null);
            if (error.response?.status !== 401) throw error;
        }
    }, [baseUrl]);

    const fetchUser = useCallback(async () => {
        await asyncHandler(fetchUserRaw, setLoading)();
    }, [fetchUserRaw]);

    const [posts, setPosts] = useState([]);

    const getPosts = useCallback(async () => {
        const result = await axios.get(baseUrl + "/api/user/post/getPosts", { withCredentials: true });
        setPosts(result.data.data);
    }, [baseUrl]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (!user?._id) {
            return;
        }

        asyncHandler(getPosts)();
    }, [user?._id, getPosts]);

    const getUserDetails = useCallback(async (userName) => {
        if(!userName){
            throw new Error("Missing username.");
        }
        const fetchedUser = await axios.get(baseUrl+`/api/user/getuserdetails/${userName}`, {withCredentials : true});
        setProfileData(fetchedUser.data.data);
        return fetchedUser.data.data;
    }, [baseUrl])

    const value = {
        user,
        setUser,
        posts,
        getPosts, 
        loading,
        edit,
        setEdit,
        createPost,
        setCreatePost,
        refetchUser: fetchUser,
        getUserDetails,
        profileData,
        setProfileData
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )


}
