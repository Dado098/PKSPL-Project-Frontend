function Navbar({ onMenuToggle }) {
  return (
    <header
      id="navbar"
      className="h-16 bg-white flex items-center justify-between px-4 md:px-6 border-b border-gray-200"
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger Button (mobile only) */}
        <button
          id="menu-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-[#1a56db]/10 hover:bg-gray-200/70"
          />
        </div>
      </div>

      {/* Profile Avatar */}
      <div className="ml-4 flex-shrink-0">
        <button
          id="profile-button"
          className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center hover:border-[#1a56db] hover:bg-gray-200 transition-all duration-200 cursor-pointer"
          aria-label="Profile menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Navbar
