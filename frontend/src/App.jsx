import React, { useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import { useUser } from './context/userContext';

function App() {
  const { user, loading } = useUser();

  if (loading) return null;
  
  return (
    <>
      <Routes>
        <Route path='/' element={user ? <Home/> : <Navigate to={"/login"}/>}/>
        <Route path="/signup" element={user ? <Navigate to={"/"}/> : <Signup/>}/>
        <Route path="/login" element={user ? <Navigate to={"/"}/> :<Login/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  )
}

export default App
