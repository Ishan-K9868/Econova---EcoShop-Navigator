
import React, { useEffect, useRef } from 'react';
import { UserProfile, EcoInterest } from '../types';
import { ECO_PACKAGING_CO2_SAVING, AVAILABLE_ECO_INTERESTS } from '../constants'; 

interface CustomerDashboardProps {
  currentCartCo2Saved: number; 
  lifetimeCo2Saved: number; 
  packagingPreference: boolean;
  onUpdatePackagingPreference: (preference: boolean) => void;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateEcoInterests: (interests: string[]) => void;
  groupBuyItemsCount: number; 
  activeGroupBuySimulationsCount: number; 
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentCartCo2Saved,
  lifetimeCo2Saved,
  packagingPreference,
  onUpdatePackagingPreference,
  onClose,
  userProfile,
  onUpdateEcoInterests,
  groupBuyItemsCount,
  activeGroupBuySimulationsCount
}) => {
  const dashboardContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardContentRef.current && !dashboardContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Only add listener if dashboard is open
    // No explicit isOpen prop, but this component is only rendered when it should be open
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleInterestToggle = (interestId: string) => {
    const updatedInterests = userProfile.ecoInterests.includes(interestId)
      ? userProfile.ecoInterests.filter(id => id !== interestId)
      : [...userProfile.ecoInterests, interestId];
    onUpdateEcoInterests(updatedInterests);
  };
  
  const hasActiveGroupBuy = groupBuyItemsCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-opacity duration-300">
      <div ref={dashboardContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Close dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-sky-600 dark:text-sky-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          My Eco Dashboard
        </h2>

        {/* Savings Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
            <h3 className="text-md font-semibold text-green-700 dark:text-green-300 mb-1">Current Cart CO₂ Saved</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentCartCo2Saved.toFixed(2)} kg</p>
            <p className="text-xs text-green-500 dark:text-green-400">From group buys & eco choices in cart.</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-900/50 p-4 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700">
            <h3 className="text-md font-semibold text-sky-700 dark:text-sky-300 mb-1">Lifetime CO₂ Saved</h3>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{lifetimeCo2Saved.toFixed(2)} kg</p>
            <p className="text-xs text-sky-500 dark:text-sky-400">Across all your sustainable purchases.</p>
          </div>
        </div>

        {/* Packaging Preference */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Sustainable Packaging</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs">
              Opt-in for sustainable packaging to reduce waste. This choice applies an estimated {ECO_PACKAGING_CO2_SAVING} kg CO₂ saving to your orders.
            </p>
            <label htmlFor="packagingToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="packagingToggle" 
                  className="sr-only" 
                  checked={packagingPreference}
                  onChange={(e) => onUpdatePackagingPreference(e.target.checked)}
                />
                <div className={`block w-12 h-7 rounded-full transition ${packagingPreference ? 'bg-green-500 dark:bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform ${packagingPreference ? 'translate-x-full border-green-500 dark:border-green-600' : 'border-slate-300 dark:border-slate-600'} border-2`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Eco Interests */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">My Eco-Interests</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Select your preferences to personalize product recommendations (AI search). </p>
            <div className="space-y-2">
                {AVAILABLE_ECO_INTERESTS.map((interest: EcoInterest) => (
                    <label key={interest.id} className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={userProfile.ecoInterests.includes(interest.id)}
                            onChange={() => handleInterestToggle(interest.id)}
                            className="form-checkbox h-5 w-5 text-green-600 bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded focus:ring-green-500 dark:focus:ring-green-400 dark:ring-offset-slate-800"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{interest.name} - <em className="text-xs text-slate-500 dark:text-slate-400">{interest.description}</em></span>
                    </label>
                ))}
            </div>
        </div>
        
        {/* Group Buy Status */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Active Group Buys</h3>
          {hasActiveGroupBuy ? (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                You have <span className="font-bold text-sky-600 dark:text-sky-400">{groupBuyItemsCount} item(s)</span> in <span className="font-bold text-sky-600 dark:text-sky-400">{activeGroupBuySimulationsCount} active group buy simulation(s)</span>.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Group buys combine orders to reduce environmental impact.</p>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">You are not currently participating in any group buys. Add items to your group buy cart to start!</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 text-sm shadow-sm hover:shadow-md"
        >
          Close Dashboard
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
