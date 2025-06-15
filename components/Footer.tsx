import React from 'react';

interface FooterProps {
  onNavigateToFAQ: () => void;
  onOpenFeedbackModal: () => void;
  onOpenSellerRegistration: () => void;
  onNavigateToSellerAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onNavigateToFAQ,
  onOpenFeedbackModal,
  onOpenSellerRegistration,
  onNavigateToSellerAdmin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:text-slate-400 text-center p-6 mt-auto">
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-4">
        <button
          onClick={onNavigateToFAQ}
          className="flex items-center bg-sky-700 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 text-sm shadow-sm"
          aria-label="Frequently Asked Questions"
          title="FAQ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
          FAQ
        </button>
        <button onClick={onOpenFeedbackModal} className="text-sm text-sky-400 hover:text-sky-300 underline transition-colors duration-150">
          Provide Feedback
        </button>
        <button onClick={onOpenSellerRegistration} className="text-sm text-amber-400 hover:text-amber-300 underline transition-colors duration-150">
          Become a Seller
        </button>
        <button onClick={onNavigateToSellerAdmin} className="text-sm text-lime-400 hover:text-lime-300 underline transition-colors duration-150">
          Seller Admin
        </button>
      </div>
      <p>&copy; {new Date().getFullYear()} EcoShop Navigator. Helping you shop sustainably.</p>
      <p className="text-xs mt-1">Powered by React, Tailwind CSS, and Generative AI.</p>
    </footer>
  );
};

export default Footer;