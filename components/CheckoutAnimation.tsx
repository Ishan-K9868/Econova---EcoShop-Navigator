
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CheckoutAnimationProps {
  isOpen: boolean;
}

const CheckoutAnimation: React.FC<CheckoutAnimationProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-black dark:bg-opacity-80 backdrop-blur-md flex flex-col items-center justify-center z-[80] p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-center transition-colors duration-300">
        <LoadingSpinner size="lg" />
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mt-6 mb-2">Processing Your Sustainable Order!</h2>
        <p className="text-gray-600 dark:text-slate-300">Thank you for making an eco-conscious choice.</p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default CheckoutAnimation;