
import React, { useEffect, useState, useRef } from 'react';
import { Product, CartType } from '../types';
import { generateProductDescription, isGeminiAvailable as checkGeminiAvailable } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ShippingOptionsPopover from './ShippingOptionsPopover'; 

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, cartType: CartType) => void;
  triggerPurchaseAnimation: (productId: string) => void;
  userEcoInterests?: string[];
}

const DetailStarRating: React.FC<{ score: number, label: string }> = ({ score, label }) => (
  <div className="flex items-center mb-1" title={`${label}: ${score.toFixed(1)}/5`}>
    <span className="text-sm text-slate-600 dark:text-slate-400 w-24">{label}:</span>
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-5 h-5 ${i < Math.round(score) ? 'text-yellow-400 dark:text-yellow-300' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">({score.toFixed(1)})</span>
  </div>
);


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, triggerPurchaseAnimation, userEcoInterests }) => {
  const [dynamicDescription, setDynamicDescription] = useState<string>('');
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean>(true);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (product) { // Only add listener if modal is open (product is not null)
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [product, onClose]);


  useEffect(() => {
    setGeminiAvailable(checkGeminiAvailable());
    if (product && checkGeminiAvailable()) {
      setIsLoadingDescription(true);
      generateProductDescription(product.name, product.category, userEcoInterests)
        .then(desc => {
          setDynamicDescription(desc);
          setIsLoadingDescription(false);
        })
        .catch(() => {
          setDynamicDescription(product.description); 
          setIsLoadingDescription(false);
        });
    } else if (product) {
      setDynamicDescription(product.description); 
    }
  }, [product, userEcoInterests]);

  if (!product) return null;

  const handleSelectShipping = (cartType: CartType) => {
    onAddToCart(product, cartType);
    triggerPurchaseAnimation(product.id);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Close product details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain rounded-lg shadow-md max-h-96" />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{product.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
            <DetailStarRating score={product.ecoScore} label="Overall EcoScore" />
            
            <div className="my-4 space-y-1">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1 text-md">Sustainability Details:</h4>
              <DetailStarRating score={product.durabilityScore} label="Durability" />
              <DetailStarRating score={product.packagingScore} label="Packaging" />
              <DetailStarRating score={product.healthImpactScore} label="Health Impact" />
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                <span className="font-medium text-slate-700 dark:text-slate-200">Materials:</span> {product.materials.join(', ') || 'N/A'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-700 dark:text-slate-200">Carbon Footprint:</span> {product.carbonFootprint} kg CO₂e
              </p>
            </div>
            
            <div className="my-4">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 text-md">Detailed Eco Ratings:</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Impact:</dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 font-semibold ml-2">({product.healthImpactScore.toFixed(1)} / 5)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">Durability:</dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 font-semibold ml-2">({product.durabilityScore.toFixed(1)} / 5)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">Packaging:</dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 font-semibold ml-2">({product.packagingScore.toFixed(1)} / 5)</dd>
                </div>
              </dl>
            </div>

            <div className="my-4">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Description:</h4>
              {isLoadingDescription ? (
                <LoadingSpinner size="sm" text="Generating description..." />
              ) : (
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {dynamicDescription || product.description}
                </p>
              )}
               {!geminiAvailable && !isLoadingDescription && <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">AI-powered description currently unavailable.</p>}
            </div>

            {product.certifications.length > 0 && (
                <div className="flex items-start text-sm text-slate-600 dark:text-slate-300 mb-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">Certifications:</span> {product.certifications.join(', ')}
                  </div>
                </div>
            )}
            
            <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-500 my-4">${product.price.toFixed(2)}</p>

            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-center mb-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 mr-1">Choose shipping:</p>
                <ShippingOptionsPopover>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-500 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </ShippingOptionsPopover>
              </div>
              <button
                onClick={() => handleSelectShipping(CartType.GROUP_BUY)}
                className="w-full bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-900 font-semibold py-3 px-4 rounded-md transition duration-150 flex items-center justify-center text-sm shadow-sm hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                Add to Group Buy Cart
              </button>
              <button
                onClick={() => handleSelectShipping(CartType.INDIVIDUAL)}
                className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 flex items-center justify-center text-sm shadow-sm hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5M15.75 8.25v-1.5a2.25 2.25 0 0 0-2.25-2.25h-1.5a2.25 2.25 0 0 0-2.25 2.25v1.5m3 0h3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Add to Individual Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
