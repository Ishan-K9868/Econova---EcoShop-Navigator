
import React from 'react';
import { ReturnablePackage } from '../../types';
import ReturnablePackageCard from './ReturnablePackageCard';
import LoadingSpinner from '../LoadingSpinner'; // Assuming you might add loading state

interface ReturnPackagingViewProps {
  packages: ReturnablePackage[];
  onInitiateReturn: (pkg: ReturnablePackage) => void;
  onSimulateProcessing: (packageId: string) => void;
  isLoading?: boolean; // Optional loading state
}

const ReturnPackagingView: React.FC<ReturnPackagingViewProps> = ({
  packages,
  onInitiateReturn,
  onSimulateProcessing,
  isLoading,
}) => {
  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-0">
          My Returnable Packaging
        </h2>
        {/* Potentially add a filter or sort options here in future */}
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading returnable packages..." />
      ) : packages.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10.5 11.25h3M12 17.25V11.25" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25V11.25M12 17.25a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M12 17.25V11.25M12 17.25a2.25 2.25 0 0 0 4.5 0m-4.5 0a2.25 2.25 0 0 1 4.5 0" />
            </svg>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
                You have no packages eligible for return at the moment.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Returnable packages from your past orders will appear here.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <ReturnablePackageCard
              key={pkg.id}
              packageData={pkg}
              onInitiateReturn={() => onInitiateReturn(pkg)}
              onSimulateProcessing={onSimulateProcessing}
            />
          ))}
        </div>
      )}
      <p className="mt-10 text-xs text-center text-slate-500 dark:text-slate-400">
        Help us close the loop! Return your packaging to earn EcoCoins and reduce waste.
      </p>
    </div>
  );
};

export default ReturnPackagingView;
