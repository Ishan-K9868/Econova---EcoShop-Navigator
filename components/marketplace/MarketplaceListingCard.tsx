
import React from 'react';
import { MarketplaceListing, MarketplaceListingStatus, MarketplaceCondition } from '../../types';
import { COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM } from '../../constants';

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  onViewDetails: () => void;
}

const CoinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-1 text-yellow-400 dark:text-yellow-300">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
    <path fillRule="evenodd" d="M10 4.5a.75.75 0 01.75.75v1.316a3.783 3.783 0 011.654.813.75.75 0 11-.916 1.158A2.286 2.286 0 0010.75 8.01V10H9.25V8.01A2.286 2.286 0 008.5 8.537a.75.75 0 11-.916-1.158 3.783 3.783 0 011.654-.813V5.25A.75.75 0 0110 4.5z" clipRule="evenodd" />
  </svg>
);

const MarketplaceListingCard: React.FC<MarketplaceListingCardProps> = ({ listing, onViewDetails }) => {
  const getConditionClass = (condition: MarketplaceCondition) => {
    switch (condition) {
      case MarketplaceCondition.NEW_WITH_TAGS: return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border-green-300 dark:border-green-600';
      case MarketplaceCondition.LIKE_NEW: return 'bg-sky-100 text-sky-800 dark:bg-sky-700 dark:text-sky-100 border-sky-300 dark:border-sky-600';
      case MarketplaceCondition.GOOD: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600';
      case MarketplaceCondition.FAIR: return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100 border-orange-300 dark:border-orange-600';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-500';
    }
  };
  
  const priceDisplay = () => {
    if (listing.currency === 'Trade' || listing.price === 'Trade') {
        return <span className="text-purple-600 dark:text-purple-400 font-semibold">Open to Trade</span>;
    }
    const currencySymbol = listing.currency === 'EcoCoins' ? 'EC' : '$';
    return `${listing.price} ${currencySymbol}`;
  };

  return (
    <div
      onClick={onViewDetails}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full border border-slate-200 dark:border-slate-700"
    >
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={listing.images[0] || 'https://picsum.photos/seed/default_mp_item/400/300'}
          alt={listing.title}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/fallback_item/400/300')}
        />
        {listing.status === MarketplaceListingStatus.SOLD && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-xl font-bold bg-red-600 px-4 py-2 rounded-md shadow-lg">SOLD</span>
          </div>
        )}
         <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getConditionClass(listing.condition)} border border-current shadow-sm`}>
          {listing.condition}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={listing.title}>
          {listing.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{listing.category}</p>
        
        <div className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
          {priceDisplay()}
        </div>

        {listing.estimatedCo2Saved !== undefined && (
          <div className="flex items-center text-xs text-green-600 dark:text-green-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Est. {listing.estimatedCo2Saved.toFixed(1)} kg CO₂ saved
          </div>
        )}

        {listing.status === MarketplaceListingStatus.AVAILABLE && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-300 dark:border-green-600" title={`Earn ${COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM} EcoCoins for purchasing this used item!`}>
              <CoinIcon />
              Earn {COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM} EcoCoins!
            </span>
          </div>
        )}
        
        <div className="mt-auto">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(); }} // Prevent card click if button has specific action
            className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 text-xs flex items-center justify-center shadow-sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceListingCard;
