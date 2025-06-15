
import React, { useState } from 'react';

interface ShippingOptionsPopoverProps {
  children: React.ReactNode; // This will be the info icon
}

const ShippingOptionsPopover: React.FC<ShippingOptionsPopoverProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-pointer"
      >
        {children}
      </span>
      {isOpen && (
        <div
          className="absolute z-20 w-64 p-3 -mt-2 text-sm leading-normal text-left text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg dark:shadow-slate-900/50 transform -translate-x-1/2 left-1/2 bottom-full mb-2 transition-opacity duration-150"
          role="tooltip"
        >
          <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-1">Shipping Options Explained</h3>
          <p className="mb-1">
            <strong className="text-green-600 dark:text-green-400">Group Buy:</strong> Combines orders with others.
            Reduces shipping emissions & costs. May take slightly longer.
          </p>
          <p>
            <strong className="text-blue-600 dark:text-blue-400">Individual Shipping:</strong> Standard direct shipping.
            Typically faster.
          </p>
           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-t-8 border-t-white dark:border-t-slate-700 border-r-8 border-r-transparent border-l-8 border-l-transparent"></div> {/* Arrow */}
        </div>
      )}
    </div>
  );
};

export default ShippingOptionsPopover;