
import React from 'react';
import { MarketplaceListing } from '../../types';
import MarketplaceListingCard from './MarketplaceListingCard';
import LoadingSpinner from '../LoadingSpinner';

interface MarketplaceViewProps {
  listings: MarketplaceListing[];
  onViewListing: (listing: MarketplaceListing) => void;
  onOpenCreateListingModal: () => void;
  isLoading: boolean;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ listings, onViewListing, onOpenCreateListingModal, isLoading }) => {
  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-0">
          Circular Economy Marketplace
        </h2>
        <button
          onClick={onOpenCreateListingModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-150 shadow-md flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          List Your Item
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading marketplace items..." />
      ) : listings.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-400 text-lg">
          The marketplace is empty. Be the first to list an item!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <MarketplaceListingCard
              key={listing.id}
              listing={listing}
              onViewDetails={() => onViewListing(listing)}
            />
          ))}
        </div>
      )}
      <p className="mt-10 text-xs text-center text-slate-500 dark:text-slate-400">
        Buy, sell, or trade pre-loved items to promote a circular economy and reduce waste.
      </p>
    </div>
  );
};

export default MarketplaceView;
