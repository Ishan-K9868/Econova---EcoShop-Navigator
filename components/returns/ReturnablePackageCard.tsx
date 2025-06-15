
import React from 'react';
import { ReturnablePackage, ReturnPackageStatus, PackageCondition } from '../../types';

interface ReturnablePackageCardProps {
  packageData: ReturnablePackage;
  onInitiateReturn: () => void;
  onSimulateProcessing: (packageId: string) => void;
}

const StatusBadge: React.FC<{ status: ReturnPackageStatus }> = ({ status }) => {
  let bgColor = 'bg-slate-100 dark:bg-slate-600';
  let textColor = 'text-slate-700 dark:text-slate-200';
  let borderColor = 'border-slate-300 dark:border-slate-500';

  switch (status) {
    case ReturnPackageStatus.RETURN_INITIATED:
      bgColor = 'bg-sky-100 dark:bg-sky-700';
      textColor = 'text-sky-800 dark:text-sky-100';
      borderColor = 'border-sky-300 dark:border-sky-600';
      break;
    case ReturnPackageStatus.PROCESSING_RETURN:
      bgColor = 'bg-yellow-100 dark:bg-yellow-700';
      textColor = 'text-yellow-800 dark:text-yellow-100';
      borderColor = 'border-yellow-300 dark:border-yellow-600';
      break;
    case ReturnPackageStatus.RETURN_COMPLETED:
      bgColor = 'bg-green-100 dark:bg-green-700';
      textColor = 'text-green-800 dark:text-green-100';
      borderColor = 'border-green-300 dark:border-green-600';
      break;
    case ReturnPackageStatus.RETURN_REJECTED:
      bgColor = 'bg-red-100 dark:bg-red-700';
      textColor = 'text-red-800 dark:text-red-100';
      borderColor = 'border-red-300 dark:border-red-600';
      break;
    case ReturnPackageStatus.DELIVERED_TO_USER:
       bgColor = 'bg-blue-100 dark:bg-blue-700';
      textColor = 'text-blue-800 dark:text-blue-100';
      borderColor = 'border-blue-300 dark:border-blue-600';
      break;
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor} border ${borderColor} shadow-sm`}>
      {status}
    </span>
  );
};


const ReturnablePackageCard: React.FC<ReturnablePackageCardProps> = ({
  packageData,
  onInitiateReturn,
  onSimulateProcessing,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-slate-200 dark:border-slate-700">
      {packageData.imageUrl && (
        <img
          className="w-full h-40 object-contain bg-slate-100 dark:bg-slate-700 p-2"
          src={packageData.imageUrl}
          alt={`Packaging for ${packageData.productName}`}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/pkg_fallback/300/200')}
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={packageData.productName}>
          Packaging for: {packageData.productName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Order ID (Sim): {packageData.orderId}</p>
        <div className="mb-3">
          <StatusBadge status={packageData.status} />
        </div>
        
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
            <p><strong>QR Code (Simulated):</strong> <span className="font-mono bg-slate-100 dark:bg-slate-700 p-1 rounded text-sky-600 dark:text-sky-400">{packageData.qrCodeData}</span></p>
            {packageData.returnByDate && <p><strong>Return By:</strong> {new Date(packageData.returnByDate).toLocaleDateString()}</p>}
            {packageData.reportedConditionByUser && <p><strong>Your Reported Condition:</strong> {packageData.reportedConditionByUser}</p>}
            {packageData.assessedConditionByHub && <p><strong>Assessed Condition:</strong> {packageData.assessedConditionByHub}</p>}
            {packageData.rewardEcoCoins !== undefined && packageData.status === ReturnPackageStatus.RETURN_COMPLETED && (
              <p className="font-semibold text-green-600 dark:text-green-400"><strong>Reward:</strong> {packageData.rewardEcoCoins} EcoCoins</p>
            )}
             {packageData.status === ReturnPackageStatus.RETURN_REJECTED && (
              <p className="font-semibold text-red-600 dark:text-red-400"><strong>Note:</strong> Return rejected. Penalty may apply.</p>
            )}
        </div>

        <div className="mt-auto space-y-2">
          {packageData.status === ReturnPackageStatus.DELIVERED_TO_USER && (
            <button
              onClick={onInitiateReturn}
              className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 text-sm shadow-sm flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              Initiate Return
            </button>
          )}
          {packageData.status === ReturnPackageStatus.RETURN_INITIATED && (
            <button
              onClick={() => onSimulateProcessing(packageData.id)}
              className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-slate-800 dark:text-slate-900 font-medium py-2 px-3 rounded-md transition duration-150 text-sm shadow-sm flex items-center justify-center"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-3.183 6.364a8.25 8.25 0 0 0-11.667 0M6.348 16.023V5.25A2.25 2.25 0 0 1 8.598 3h6.804a2.25 2.25 0 0 1 2.25 2.25v10.773" /></svg>
              Simulate Hub Processing
            </button>
          )}
           {(packageData.status === ReturnPackageStatus.RETURN_COMPLETED || packageData.status === ReturnPackageStatus.RETURN_REJECTED || packageData.status === ReturnPackageStatus.PROCESSING_RETURN) && (
             <p className="text-xs text-center text-slate-500 dark:text-slate-400 py-1">No actions available for this package.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default ReturnablePackageCard;
