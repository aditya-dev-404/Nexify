import React from 'react'
import { FaSearch } from "react-icons/fa";

function MobileSearch({handleSearch}) {
    return (
        <>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="md:hidden fixed top-[60px] left-0 w-full z-40 bg-[var(--surface)] px-4 py-3 shadow-[0_4px_12px_var(--shadow-dark)]"
            >
                <div className="flex items-center neo-inset rounded-full px-4 py-2 w-full">
                    <FaSearch className="text-[var(--text-muted)] text-sm flex-shrink-0" />
                    <input
                        type="text"
                        autoFocus
                        placeholder='Search'
                        className="bg-transparent border-none outline-none px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] w-full min-w-0"
                    />
                </div>
            </form>
        </>
    )
}

export default MobileSearch