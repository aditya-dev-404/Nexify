import React, { useEffect } from 'react'
import naxifyMark from '../assets/nexify-mark.svg'
import profile from '../assets/profile.png'
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useState } from 'react';
import { useUser } from '../context/userContext';
import { useAuth } from '../context/userAuth.js'
import NavPopUp from './NavPopUp';
import BottomBarForMobile from './BottomBarForMobile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




function Navbar() {

    const [searchOpen, setSearchOpen] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);
    const { user } = useUser();
    const { baseUrl } = useAuth();
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchData(query);

        if (!query.trim()) {
            setSearchResult([]);
        }
    };

    useEffect(() => {
        // Abort controller prevents race conditions if searchData changes rapidly
        const controller = new AbortController();
        const fetchResults = async () => {
            try {
                const result = await axios.get(`${baseUrl}/api/user/search?query=${encodeURIComponent(searchData)}`,
                    { withCredentials: true, signal: controller.signal });
                setSearchResult(result.data.data);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error('Search error:', err);
                }
            }
        };
        if (!searchData.trim()) {
            return () => controller.abort();
        }

        fetchResults();

        return () => controller.abort(); // Cleanup previous pending request
    }, [searchData, baseUrl]); // Include all external dependencies used inside






    return (
        <>
            <div className="nav-main flex items-center w-full h-[60px] md:h-[80px] fixed top-0 left-0 z-50 bg-[var(--surface)] shadow-[0_4px_16px_var(--shadow-dark)] px-4 md:px-8 gap-3">

                <div className="logo flex-shrink-0">
                    <img src={naxifyMark} alt="logo" className='w-[36px] md:w-[50px]' />
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="hidden md:flex items-center neo-inset rounded-full ml-[20%] px-8 py-2 w-full max-w-[320px]"
                >
                    <FaSearch className="text-[var(--text-muted)] text-sm flex-shrink-0" />
                    <input
                        onChange={handleSearchChange}
                        value={searchData}
                        type="text"
                        placeholder='Search'
                        className="bg-transparent border-none outline-none px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] w-full min-w-0"
                    />
                </form>


                <div className="flex items-center gap-2 md:gap-3 ml-auto flex-shrink-0">


                    <button
                        type="button"
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-[var(--text-muted)] mr-2 active:text-[var(--primary)]"
                    >
                        <FaSearch className="text-lg" />
                    </button>

                    <div className="hidden md:flex items-center gap-3">
                        <div onClick={() => navigate('/')} className="home flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-light)] cursor-pointer transition">
                            <FaHome className="text-lg" />
                            <p className="text-[11px] leading-none">Home</p>
                        </div>

                        <div onClick={() => navigate('/networks')} className="my-network flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-light)] cursor-pointer transition">
                            <IoPeople className="text-lg" />
                            <p className="text-[11px] leading-none">My Network</p>
                        </div>

                        <div className="notification relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-light)] cursor-pointer transition">
                            <FaBell className="text-lg" />
                            <p className="text-[11px] leading-none">Notifications</p>
                            <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-[var(--danger)]"></span>
                        </div>
                    </div>


                    <div
                        className="profile cursor-pointer"
                        onClick={() => setProfileClicked(!profileClicked)}
                    >
                        <img
                            src={user.profileImage.url}
                            alt="dp"
                            className='h-[34px] w-[34px] md:h-[44px] md:w-[44px] rounded-full object-cover shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]'
                        />
                    </div>

                    {profileClicked && (
                        <NavPopUp profileClick={setProfileClicked} />
                    )}

                </div>






                {searchData.trim() && (
                    <div className={`absolute ${searchOpen ? 'top-[116px]' : 'top-[calc(100%+8px)]'} left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 overflow-hidden rounded-2xl neo bg-[var(--surface)] shadow-[0_8px_24px_var(--shadow-dark)]`}>
                        {searchResult.length > 0 ? (
                            searchResult.map((searchUser) => (
                                <button
                                    key={searchUser._id}
                                    type="button"
                                    onClick={() => {
                                        navigate(`/profile/${searchUser.userName}`);
                                        setSearchData("");
                                        setSearchResult([]);
                                        setSearchOpen(false);
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--surface-light)]"
                                >
                                    <img
                                        src={searchUser.profileImage?.url || profile}
                                        alt={`${searchUser.firstName} ${searchUser.lastName}`}
                                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                                    />
                                    <span className="min-w-0">
                                        <span className="block truncate capitalize text-sm font-medium text-[var(--text)]">
                                            {searchUser.firstName} {searchUser.lastName}
                                        </span>
                                        <span className="block truncate text-xs text-[var(--text-muted)]">
                                            {searchUser.headings || 'Nexify user'}
                                        </span>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p className="px-4 py-5 text-center text-sm text-[var(--text-muted)]">No users found.</p>
                        )}
                    </div>
                )}














            </div>

            {searchOpen && (<form
                onSubmit={(e) => e.preventDefault()}
                className="md:hidden fixed top-[60px] left-0 w-full z-40 bg-[var(--surface)] px-4 py-3 shadow-[0_4px_12px_var(--shadow-dark)]"
            >
                <div className="flex items-center neo-inset rounded-full px-4 py-2 w-full">
                    <FaSearch className="text-[var(--text-muted)] text-sm flex-shrink-0" />
                    <input
                        onChange={handleSearchChange}
                        value={searchData}
                        type="text"
                        autoFocus
                        placeholder='Search'
                        className="bg-transparent border-none outline-none px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] w-full min-w-0"
                    />
                </div>
            </form>)}

            <BottomBarForMobile />

            <div className="h-[60px] md:h-[80px]"></div>

        </>
    )
}

export default Navbar








