
import React, { useState, useEffect, useRef } from 'react';
import { ReturnablePackage, PackageCondition } from '../../types';

interface ReturnInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: ReturnablePackage;
  onInitiateReturn: (packageId: string, reportedCondition: PackageCondition) => void;
}

const ReturnInitiationModal: React.FC<ReturnInitiationModalProps> = ({
  isOpen,
  onClose,
  packageData,
  onInitiateReturn,
}) => {
  const [reportedCondition, setReportedCondition] = useState<PackageCondition>(PackageCondition.GOOD);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setReportedCondition(PackageCondition.GOOD); // Reset on open
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onInitiateReturn(packageData.id, reportedCondition);
  };
  
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
  const selectClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm";


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[95] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Initiate Package Return
          </h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are returning packaging for: <strong>{packageData.productName}</strong> (Order: {packageData.orderId}).
          </p>

          <div>
            <label htmlFor="packageCondition" className={labelClass}>
              Package Condition <span className="text-red-500">*</span>
            </label>
            <select
              id="packageCondition"
              value={reportedCondition}
              onChange={(e) => setReportedCondition(e.target.value as PackageCondition)}
              className={selectClass}
            >
              {Object.values(PackageCondition).map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Be honest! This helps us process returns efficiently and affects your EcoCoin reward.
            </p>
          </div>

          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Simulated Return Instructions:</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              1. Ensure the packaging is empty and reasonably clean.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              2. Present this QR Code at a designated drop-off point (simulated):
            </p>
            <div className="my-2 p-3 bg-white dark:bg-slate-800 rounded text-center font-mono text-lg text-sky-600 dark:text-sky-400 shadow">
              {packageData.qrCodeData}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                (In a real app, this would be a scannable QR image.)
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md"
          >
            Confirm and Initiate Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnInitiationModal;
