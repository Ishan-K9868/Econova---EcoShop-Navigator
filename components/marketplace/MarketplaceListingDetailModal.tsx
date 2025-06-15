
import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceListing, UserProfile, MarketplaceListingStatus } from '../../types';

interface MarketplaceListingDetailModalProps {
  listing: MarketplaceListing | null;
  onClose: () => void;
  onPurchase: (listingId: string) => void;
  currentUserProfile: UserProfile; // To check if current user is the seller
  onOpenChat: (listing: MarketplaceListing) => void; // New prop to open chat
}

const MarketplaceListingDetailModal: React.FC<MarketplaceListingDetailModalProps> = ({ 
    listing, 
    onClose, 
    onPurchase, 
    currentUserProfile,
    onOpenChat
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (listing) {
      document.addEventListener('mousedown', handleClickOutside);
      setCurrentImageIndex(0); // Reset image index when a new listing is viewed
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listing, onClose]);

  if (!listing) return null;

  const isSold = listing.status === MarketplaceListingStatus.SOLD;
  const isOwner = listing.userId === currentUserProfile.userId;

  const priceDisplay = () => {
    if (listing.currency === 'Trade' || listing.price === 'Trade') {
      return <span className="text-purple-600 dark:text-purple-400 font-bold">Open to Trade</span>;
    }
    const currencySymbol = listing.currency === 'EcoCoins' ? 'EC' : '$';
    return <span className="font-bold">{listing.price} {currencySymbol}</span>;
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (listing.images.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (listing.images.length || 1)) % (listing.images.length || 1));
  };
  
  const DetailItem: React.FC<{label: string, value: string | number | undefined | React.ReactNode}> = ({label, value}) => (
    <div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{label}: </span>
        <span className="text-slate-600 dark:text-slate-400">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[95] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate pr-8" title={listing.title}>
            {listing.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          <div className="relative mb-4">
            <img
              src={listing.images[currentImageIndex] || 'https://picsum.photos/seed/detail_item/600/400'}
              alt={`${listing.title} - image ${currentImageIndex + 1}`}
              className="w-full h-64 sm:h-80 object-contain rounded-lg bg-slate-100 dark:bg-slate-700"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/fallback_detail/600/400')}
            />
            {listing.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                  {listing.images.map((_, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-sky-500' : 'bg-white/70 hover:bg-white'}`}></button>
                  ))}
                </div>
              </>
            )}
             {isSold && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white text-3xl font-bold bg-red-600 px-6 py-3 rounded-md shadow-lg transform -rotate-6">SOLD</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <DetailItem label="Price" value={priceDisplay()} />
            <DetailItem label="Category" value={listing.category} />
            <DetailItem label="Condition" value={listing.condition} />
            <DetailItem label="Description" value={<p className="whitespace-pre-wrap">{listing.description}</p>} />
            <DetailItem label="Seller (Simulated ID)" value={listing.userId} />
            <DetailItem label="Listed On" value={new Date(listing.listedDate).toLocaleDateString()} />
            {listing.location && <DetailItem label="Location" value={listing.location} />}
            {listing.estimatedCo2Saved !== undefined && 
              <DetailItem 
                label="Est. CO₂ Saved" 
                value={<span className="text-green-600 dark:text-green-400 font-semibold">{listing.estimatedCo2Saved.toFixed(1)} kg</span>} 
              />
            }
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {isSold ? (
            <p className="text-center font-semibold text-red-600 dark:text-red-400 py-2">This item has been sold.</p>
          ) : isOwner ? (
            <p className="text-center font-semibold text-sky-600 dark:text-sky-400 py-2">This is your listing.</p>
          ) : (
            <>
              <button
                onClick={() => onPurchase(listing.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md"
              >
                {listing.price === 'Trade' || listing.currency === 'Trade' ? "Propose Trade (Simulated)" : "Purchase Item (Simulated)"}
              </button>
              <button
                onClick={() => onOpenChat(listing)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.312 3.75 12.375 3.75S21 7.444 21 12Z" />
                </svg>
                Chat with Seller (Simulated)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceListingDetailModal;
