import React, { useContext } from 'react'
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


function Signup() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const navigate = useNavigate();

    const { baseUrl } = useAuth();
    const { setUser } = useUser();

    const handleSignup = asyncHandler(async (e) => {
        e.preventDefault();
        if (!verified) {
            throw new Error("Please verify your email before signing up.");
        }
        const result = await axios.post(baseUrl + '/api/auth/signup', {
            firstName,
            lastName,
            userName,
            email,
            password
        }, { withCredentials: true })
        setUser(result.data.data);
        toast.success(result.data.message);
        navigate('/');
    }, setLoading)


    const handleSendOtp = asyncHandler(async () => {
        if (!email.trim()) {
            throw new Error("Enter your email.")
        }
        await axios.post(`${baseUrl}/api/auth/sendverificationotp`, { email: email.trim() }, { withCredentials: true });
        setOtpSent(true);
        setOtp("");
    }, setSendingOtp)

    const handleOtpSubmit = asyncHandler(async () => {
        if (!email.trim() || otp.trim().length !== 6) {
            throw new Error("Enter a valid email and 6-digit OTP.")
        }
        const result = await axios.post(`${baseUrl}/api/auth/verifyotp`, { email: email.trim(), otp: otp.trim() }, { withCredentials: true });
        if (result.data.success) {
            setVerified(true);
            setOtpSent(false);
        }
    }, setVerifyingOtp)

    return (
        <>
            <div className="w-full min-h-screen bg-[var(--bg)] relative flex flex-col md:flex-row items-center justify-center overflow-y-auto py-6 px-4 md:p-0">

                <div className="static md:absolute top-0 left-0 mb-4 md:mb-0 p-0 md:p-[35px] w-full md:w-auto flex justify-center md:justify-start">
                    <img src={logo} alt="logo" className='h-[45px] w-[165px] md:h-[60px] md:w-[220px]' />
                </div>

                <form onSubmit={handleSignup} className="neo w-full max-w-[400px] flex flex-col gap-3 md:gap-4 p-6 md:p-8 mx-auto md:mx-4">
                    <h1 className="text-[var(--text)] text-xl md:text-2xl font-semibold text-center mb-1 md:mb-2">
                        Sign Up
                    </h1>

                    <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First name" name="firstName" required
                        className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                    <input onChange={(e) => setLastName(e.target.value)} placeholder="Last name" name="lastName"
                        className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                    <input onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Username" name="userName" required
                        className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                    <div className="email-otp-section flex flex-col gap-3 w-full">
                        <div className="send neo-inset flex items-center w-full rounded-full pl-4 pr-1.5 py-1.5">
                            <input
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setVerified(false);
                                }}
                                type="email"
                                placeholder="Email"
                                name="email"
                                readOnly={otpSent || verified}
                                required
                                className="bg-transparent border-none outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full min-w-0"
                            />
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpSent || verified || sendingOtp}
                                className="neo-inset shrink-0 whitespace-nowrap text-xs px-3 py-2 rounded-full text-[var(--primary)] font-medium hover:opacity-80 active:scale-[0.96] transition disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {sendingOtp ? "Sending..." : verified ? "Verified" : "Send OTP"}
                            </button>
                        </div>

                        {otpSent && (
                            <div className="verify neo-inset flex items-center w-full rounded-full pl-4 pr-1.5 py-1.5">
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    className="bg-transparent border-none outline-none placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:tracking-normal placeholder:font-normal text-[var(--primary)] text-lg font-semibold tracking-[6px] w-full min-w-0"
                                />
                                <button
                                    type="button"
                                    onClick={handleOtpSubmit}
                                    disabled={verifyingOtp}
                                    className="gradient-btn shrink-0 whitespace-nowrap text-white text-xs px-3 py-2 rounded-full font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {verifyingOtp ? "Verifying..." : "Verify"}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="passInput relative w-full">
                        <input onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="Password" name="password" required className="neo-inset border-none outline-none px-4 py-3 pr-11 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                        <div className="toggle absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer text-lg" onClick={() => setShow(!show)}>
                            {show ? <HiEyeOff /> : <IoEyeSharp />}
                        </div>
                    </div>
                    <button type="submit" disabled={!verified || loading} className={`${!verified || loading ? "text-[--text-muted]" : ""} gradient-btn text-white text-sm font-medium py-3 rounded-[20px] mt-2 hover:opacity-90 active:scale-[0.98] transition`}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <p className="text-center text-sm text-[var(--text-muted)] mt-2">
                        Already have an account?{" "}
                        <Link to={"/login"} className="text-[var(--primary)] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Signup
