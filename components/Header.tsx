import React from 'react';
import { Theme } from '../types'; // Import Theme type
import type { NavTarget } from '../App'; // Import NavTarget for specific dashboard handler


interface HeaderProps {
  onGoHome: () => void;
  onShowCart: () => void;
  userCoins: number;
  cartItemCount: number;
  theme: Theme;
  toggleTheme: () => void;
  onToggleSidebar: () => void;
  onShowDashboard: () => void; // Handler for My Dashboard modal
  onShowPersonalImpactDashboard: () => void; // Handler for My Impact view
  onShowWalletPage: () => void; // New prop to directly show wallet page
}

const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onShowCart,
  userCoins,
  cartItemCount,
  theme,
  toggleTheme,
  onToggleSidebar,
  onShowDashboard,
  onShowPersonalImpactDashboard,
  onShowWalletPage, // Destructure new prop
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md p-3 sm:p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <button
            onClick={onGoHome}
            className="flex items-center mr-2 sm:mr-4 text-white hover:opacity-80 transition duration-150"
            aria-label="Go to Homepage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0 0 12 16.5c2.998 0 5.74-1.1 7.843-2.918" />
            </svg>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight ml-1 sm:ml-2">EcoShop Navigator</h1>
          </button>
        </div>

        {/* Essential Right-Side Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* My Impact Button */}
          <button
            onClick={onShowPersonalImpactDashboard}
            className="hidden sm:flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 text-xs sm:text-sm shadow-sm"
            aria-label="View My Impact"
            title="My Impact Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            My Impact
          </button>

          {/* My Dashboard Button */}
           <button
            onClick={onShowDashboard}
            className="hidden sm:flex items-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 text-xs sm:text-sm shadow-sm"
            aria-label="Open My Dashboard"
            title="My Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            My Dashboard
          </button>


          {/* EcoCoins Wallet */}
          <button
            onClick={onShowWalletPage} // Changed from onToggleSidebar
            className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-slate-900 font-medium py-2 px-3 sm:px-4 rounded-md transition duration-150 text-xs sm:text-sm flex items-center shadow-sm"
            aria-label="Open Wallet"
            title="My EcoCoins Wallet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6.248a2.251 2.251 0 0 1-2.062 2.248H5.062A2.251 2.251 0 0 1 3 18.248V12m18 0V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v5.25m0 0H21M12 15V9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75Zm3.75-1.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {userCoins}
          </button>
          
          {/* Cart Button */}
          <button
            onClick={onShowCart}
            className="relative bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 sm:px-4 rounded-md transition duration-150 text-xs sm:text-sm flex items-center shadow-sm"
            aria-label="Open Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors duration-150"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21c3.09 0 5.839-1.107 7.95-2.948a9.75 9.75 0 0 0 .802-3.05Z" />
              </svg>
            )}
          </button>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors duration-150"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
