import React from 'react';
import { AppViewType, SellerFormData, UserProfile } from '../types';
import type { NavTarget } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavTarget) => void;
  // Removed: onShowDashboard, onShowPersonalImpactDashboard
  onShowExternalAnalyzer: () => void; // This now means navigating to 'analyzeExternal'
  onNavigateToMarketplace: () => void;
  onNavigateToReturns: () => void;
  onNavigateToFAQ: () => void;
  onOpenFeedbackModal: () => void;
  onOpenSellerRegistration: () => void;
  onNavigateToSellerAdmin: () => void;
  isSellerLoggedIn: boolean;
  sellerApplicationData: SellerFormData | null;
  userProfileName?: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  colorClasses?: string; // For color coding
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick, disabled = false, title, colorClasses }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title || label}
    className={`flex items-center w-full text-left px-4 py-3 text-sm rounded-md transition-colors duration-150
                ${disabled 
                  ? 'text-slate-500 dark:text-slate-600 cursor-not-allowed' 
                  : colorClasses || 'text-slate-200 hover:bg-slate-600 dark:hover:bg-slate-500'}`}
  >
    <span className="mr-3 w-5 h-5">{icon}</span>
    {label}
  </button>
);

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
    <div className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {title}
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowExternalAnalyzer, // Keep, might be a specific modal or view change
  onNavigateToMarketplace,
  onNavigateToReturns,
  onNavigateToFAQ,
  onOpenFeedbackModal,
  onOpenSellerRegistration,
  onNavigateToSellerAdmin,
  isSellerLoggedIn,
  sellerApplicationData,
  userProfileName,
}) => {
  const handleNavigationClick = (view: NavTarget) => {
    onNavigate(view);
    onClose(); 
  };
  
  const handleModalOpenClick = (modalOpener: () => void) => {
    modalOpener();
    onClose();
  };

  // Define color classes for different sections
  const exploreColor = "text-sky-300 hover:bg-sky-700 dark:text-sky-300 dark:hover:bg-sky-700/50";
  const activityColor = "text-lime-300 hover:bg-lime-700 dark:text-lime-300 dark:hover:bg-lime-700/50";
  const sellerColor = "text-amber-300 hover:bg-amber-700 dark:text-amber-300 dark:hover:bg-amber-700/50";
  const supportColor = "text-purple-300 hover:bg-purple-700 dark:text-purple-300 dark:hover:bg-purple-700/50";


  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''} fixed top-0 right-0 h-full w-72 sm:w-80 bg-slate-800 dark:bg-slate-900 text-white shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out`}
      aria-hidden={!isOpen}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-slate-700">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-700 dark:hover:bg-slate-600"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-grow p-3 space-y-0.5 overflow-y-auto">
        {userProfileName && (
            <div className="px-3 py-3 mb-1 border-b border-slate-700">
                <p className="text-sm text-slate-400">Hello,</p>
                <p className="font-semibold text-slate-100">{userProfileName}</p>
            </div>
        )}
        
        <SectionHeading title="Explore & Shop" />
        <SidebarItem 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h2.64m-13.5 0H9.36m9.72-7.5H10.5a.75.75 0 0 0-.75.75V21m7.5-7.5h-2.586a.75.75 0 0 0-.707.467l-1.414 2.828a.75.75 0 0 0 .53 1.214H18M4.5 4.5v6.75m0 0h5.25m-5.25 0H3" /></svg>}
          label="Marketplace"
          onClick={() => handleNavigationClick('marketplace')}
          colorClasses={exploreColor}
        />
        <SidebarItem 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m4.004-1.252a11.93 11.93 0 0 0-8.008 0M12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 16.5A2.625 2.625 0 0 0 15.375 13.875M12.75 16.5v2.625A2.625 2.625 0 0 1 10.125 21.75M12.75 16.5V12M11.25 12A2.625 2.625 0 0 0 8.625 14.625M11.25 12v3.375c0 .621.504 1.125 1.125 1.125M11.25 12V8.25A2.625 2.625 0 0 1 13.875 5.625M11.25 12h3.375c.621 0 1.125-.504 1.125-1.125M11.25 12H7.875A2.625 2.625 0 0 0 5.25 14.625m6.875-11.625A2.625 2.625 0 0 0 9.375 5.625" /></svg>}
          label="Analyze Product"
          onClick={() => handleNavigationClick('analyzeExternal')}
          colorClasses={exploreColor}
        />

        <SectionHeading title="My Activity" />
        <SidebarItem 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>}
          label="My Returns"
          onClick={() => handleNavigationClick('returns')}
          colorClasses={activityColor}
        />
        
        <SectionHeading title="Seller Zone" />
        {isSellerLoggedIn ? (
          <SidebarItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h2.64m-13.5 0H9.36M9.75 12.065A2.25 2.25 0 0 1 12 9.815a2.25 2.25 0 0 1 2.25 2.25V21M9.75 12.065V21m2.25-8.935A2.25 2.25 0 0 0 12 9.815V3.75M21 3.75H3v6.065A2.25 2.25 0 0 0 5.25 12h13.5A2.25 2.25 0 0 0 21 9.815V3.75Z" /></svg>}
            label="Seller Admin"
            onClick={() => handleNavigationClick('sellerAdmin')}
            colorClasses={sellerColor}
          />
        ) : !sellerApplicationData ? (
          <SidebarItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>}
            label="Become a Seller"
            onClick={() => handleModalOpenClick(onOpenSellerRegistration)}
            colorClasses={sellerColor}
          />
        ) : (
             <SidebarItem 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.75m11.378 11.378a2.25 2.25 0 0 1-3.182 0M16.5 12A2.25 2.25 0 0 1 18.75 9.75V9H13.5V4.5H12V3.75M9 15.75A2.25 2.25 0 0 1 6.75 18H6v.75a2.25 2.25 0 0 0 2.25 2.25h.75M9 15.75A2.25 2.25 0 0 0 6.75 18H6v.75a2.25 2.25 0 0 1 2.25 2.25h.75m6.75-13.5V3.75M9 15.75V3.75" /></svg>}
                label="Login as Seller"
                onClick={() => handleNavigationClick('sellerAdmin')} 
                colorClasses={sellerColor}
             />
        )}
        
        <SectionHeading title="Help & Support" />
        <SidebarItem 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>}
          label="FAQ"
          onClick={() => handleNavigationClick('faq')}
          colorClasses={supportColor}
        />
        <SidebarItem 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.75 6a7.5 7.5 0 0 1 15 0v3a7.5 7.5 0 0 1-7.5 7.5S3.75 12 3.75 9V6Zm4.5-3.75A2.25 2.25 0 0 1 10.5 0h3a2.25 2.25 0 0 1 2.25 2.25V6H8.25V2.25Z" /></svg>}
          label="Provide Feedback"
          onClick={() => handleModalOpenClick(onOpenFeedbackModal)}
          colorClasses={supportColor}
        />
        
      </nav>
    </div>
  );
};

export default Sidebar;
