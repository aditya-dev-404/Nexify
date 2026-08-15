import React from 'react'
import logo from '../assets/nexify-logo.svg'
import { useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import { HiEyeOff } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/userAuth.js'
import { useUser } from '../context/userContext.js'
import axios from 'axios';
import { asyncHandler } from '../utils/async.handler.js';
import { toast } from 'react-toastify';

// ""
// ""

function Login() {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetPass, setResetPass] = useState(false);
    const [resetOtpSent, setResetOtpSent] = useState(false);
    const [sendingResetOtp, setSendingResetOtp] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();
    const { baseUrl } = useAuth();
    const { setUser } = useUser();

    const handleLogin = asyncHandler(async (e) => {
        e.preventDefault();
        const result = await axios.post(baseUrl + '/api/auth/login', {
            email,
            password
        }, { withCredentials: true })
        console.log(result.data.data);
        setUser(result.data.data);
        toast.success(result.data.message);
        navigate('/');
    }, setLoading)

    const openResetPassword = () => {
        setResetPass(true);
        setResetOtpSent(false);
        setOtp("");
        setNewPassword("");
    };

    const cancelResetPassword = () => {
        setResetPass(false);
        setResetOtpSent(false);
        setOtp("");
        setNewPassword("");
    };

    const sendResetOtp = asyncHandler(async () => {
        if (!email.trim()) {
            throw new Error("Enter your email address.");
        }

        await axios.post(`${baseUrl}/api/auth/sendpassresetotp`, { email: email.trim() }, { withCredentials: true });
        setResetOtpSent(true);
        setOtp("");
    }, setSendingResetOtp);

    const changePass = asyncHandler(async () => {
        if (otp.trim().length !== 6) {
            throw new Error("Enter the 6-digit OTP.");
        }
        if (!newPassword) {
            throw new Error("Enter a new password.");
        }

        const result = await axios.post(
            `${baseUrl}/api/auth/verifyresetpassotp`,
            { email: email.trim(), otp: otp.trim(), newPassword },
            { withCredentials: true }
        );
        toast.success(result.data.message || "Password changed successfully. Please log in.");
        setPassword("");
        cancelResetPassword();
    }, setChangingPassword);
  return (
        <>
            <div className="w-full min-h-screen bg-[var(--bg)] relative flex flex-col md:flex-row items-center justify-center overflow-y-auto py-6 px-4 md:p-0">

                <div className="static md:absolute top-0 left-0 mb-4 md:mb-0 p-0 md:p-[35px] w-full md:w-auto flex justify-center md:justify-start">
                    <img src={logo} alt="logo" className='h-[45px] w-[165px] md:h-[60px] md:w-[220px]' />
                </div>

                <form onSubmit={resetPass ? (e) => e.preventDefault() : handleLogin} className="neo w-full max-w-[400px] flex flex-col gap-3 md:gap-4 p-6 md:p-8 mx-auto md:mx-4">
                    <h1 className="text-[var(--text)] text-xl md:text-2xl font-semibold text-center mb-1 md:mb-2">
                        {resetPass ? "Reset Password" : "Login"}
                    </h1>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" name="email" required readOnly={resetPass && resetOtpSent}
                            className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />

                    {!resetPass ? (
                        <>
                            <div className="passInput relative w-full">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="Password" name="password" required className="neo-inset border-none outline-none px-4 py-3 pr-11 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <button type="button" aria-label="Toggle password visibility" className="toggle absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer text-lg" onClick={() => setShow(!show)}>
                                    {show ? <HiEyeOff /> : <IoEyeSharp />}
                                </button>
                            </div>
                            <button type="button" onClick={openResetPassword} className="w-fit text-sm text-[var(--primary)] font-medium hover:underline">
                                Forgot password?
                            </button>
                            <button type="submit" disabled={loading} className={`${loading ? "text-[--text-muted]" : ""} gradient-btn text-white text-sm font-medium py-3 rounded-[20px] mt-2 hover:opacity-90 active:scale-[0.98] transition`}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </>
                    ) : !resetOtpSent ? (
                        <>
                            <p className="text-sm text-[var(--text-muted)]">We’ll email you a one-time code to reset your password.</p>
                            <button type="button" onClick={sendResetOtp} disabled={sendingResetOtp} className="gradient-btn text-white text-sm font-medium py-3 rounded-[20px] hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50">
                                {sendingResetOtp ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </>
                    ) : (
                        <>
                            <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="Enter 6-digit OTP" name="otp" inputMode="numeric" maxLength={6} required className="neo-inset border-none outline-none px-4 py-3 w-full min-w-0 text-[var(--primary)] text-lg font-semibold tracking-[6px] placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:tracking-normal placeholder:font-normal focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]"/>
                            <div className="passInput relative w-full">
                                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showNewPassword ? "text" : "password"} placeholder="New password" name="newPassword" required className="neo-inset border-none outline-none px-4 py-3 pr-11 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <button type="button" aria-label="Toggle new password visibility" className="toggle absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer text-lg" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <HiEyeOff /> : <IoEyeSharp />}
                                </button>
                            </div>
                            <button type="button" onClick={changePass} disabled={changingPassword} className="gradient-btn text-white text-sm font-medium py-3 rounded-[20px] hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50">
                                {changingPassword ? "Changing password..." : "Change password"}
                            </button>
                        </>
                    )}
                    {resetPass && (
                        <button type="button" onClick={cancelResetPassword} className="text-sm text-[var(--primary)] font-medium hover:underline">
                            Back to login
                        </button>
                    )}
                    <p className="text-center text-sm text-[var(--text-muted)] mt-2">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="text-[var(--primary)] font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </>
  )
}

export default Login
