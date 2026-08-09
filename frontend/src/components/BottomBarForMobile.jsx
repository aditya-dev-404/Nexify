import React from 'react'
import { FaHome } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function BottomBarForMobile() {
    const navigate = useNavigate();
  return (
    <>
     <div
                className="md:hidden flex items-center justify-around w-full fixed bottom-0 left-0 z-50 bg-[var(--surface)] shadow-[0_-4px_16px_var(--shadow-dark)] px-2"
                style={{ height: "60px", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div onClick={()=>navigate("/")} className="home flex flex-col items-center justify-center gap-0.5 text-[var(--text-muted)] active:text-[var(--primary)] cursor-pointer">
                    <FaHome className="text-xl" />
                    <p className="text-[10px] leading-none">Home</p>
                </div>

                    <div onClick={()=>navigate('/networks')} className="my-network flex flex-col items-center justify-center gap-0.5 text-[var(--text-muted)] active:text-[var(--primary)] cursor-pointer">
                    <IoPeople className="text-xl" />
                    <p className="text-[10px] leading-none">Network</p>
                </div>

                <div className="notification relative flex flex-col items-center justify-center gap-0.5 text-[var(--text-muted)] active:text-[var(--primary)] cursor-pointer">
                    <FaBell className="text-xl" />
                    <p className="text-[10px] leading-none">Alerts</p>
                    <span className="absolute top-0 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)]"></span>
                </div>
            </div>
    </>
  )
}

export default BottomBarForMobile