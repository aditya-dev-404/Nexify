import { toast } from 'react-toastify'


// utils/asyncHandler.js
export const asyncHandler = (fn, setLoading) => async (...args) => {
  try {
    if(setLoading) setLoading(true);
    return await fn(...args);
  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || err.message || "Something went wrong";
    toast.error(message);
  }finally{
    if(setLoading)setLoading(false);
  }
};