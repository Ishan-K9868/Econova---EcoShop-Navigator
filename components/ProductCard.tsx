
import React, { useState } from 'react';
import { Product, CartType } from '../types';
import ShippingOptionsPopover from './ShippingOptionsPopover';
import { COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE, HIGH_ECOSCORE_THRESHOLD } from '../constants'; // Import constants

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, cartType: CartType) => void;
  triggerPurchaseAnimation: (productId: string) => void;
}

const StarRating: React.FC<{ score: number, label?: string }> = ({ score, label }) => {
  return (
    <div className="flex items-center" title={label ? `${label}: ${score.toFixed(1)}/5` : `${score.toFixed(1)}/5`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(score) ? 'text-yellow-400 dark:text-yellow-300' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">({score.toFixed(1)})</span>
    </div>
  );
};

const SustainabilityFeature: React.FC<{ icon: React.ReactNode, label: string, value?: string | number, score?: number}> = ({ icon, label, value, score }) => (
  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400" title={`${label}${value ? ': ' + value : ''}${score ? ': '+score.toFixed(1)+'/5' : ''}`}>
    <span className="mr-1.5 text-sky-600 dark:text-sky-400">{icon}</span>
    {label}: {score !== undefined ? <StarRating score={score} /> : <span className="font-medium ml-1 text-slate-700 dark:text-slate-300">{value}</span>}
  </div>
);

const CoinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-1 text-yellow-400 dark:text-yellow-300">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
    <path fillRule="evenodd" d="M10 4.5a.75.75 0 01.75.75v1.316a3.783 3.783 0 011.654.813.75.75 0 11-.916 1.158A2.286 2.286 0 0010.75 8.01V10H9.25V8.01A2.286 2.286 0 008.5 8.537a.75.75 0 11-.916-1.158 3.783 3.783 0 011.654-.813V5.25A.75.75 0 0110 4.5z" clipRule="evenodd" />
  </svg>
);


const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart, triggerPurchaseAnimation }) => {
  const [showShippingChoice, setShowShippingChoice] = useState(false);
  const isHighEcoScoreProduct = product.ecoScore >= HIGH_ECOSCORE_THRESHOLD;

  const handleAddToCartClick = () => {
    setShowShippingChoice(true);
  };

  const handleSelectShipping = (cartType: CartType) => {
    onAddToCart(product, cartType);
    triggerPurchaseAnimation(product.id);
    setShowShippingChoice(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-px flex flex-col h-full relative w-72"> {/* Added w-72 for fixed width */}
      <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{product.category}</p>
        
        <div className="mb-2">
          <StarRating score={product.ecoScore} label="Overall EcoScore" />
        </div>

        <div className="mb-2 min-h-4"> {/* Ensure this div has a minimum height */}
          {isHighEcoScoreProduct && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-300 dark:border-green-600" title={`Earn ${COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE} EcoCoins for choosing this sustainable product!`}>
              <CoinIcon />
              Earn {COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE} EcoCoins!
            </span>
          )}
        </div>

        <div className="space-y-1 mb-3 text-xs">
          <SustainabilityFeature 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l-.995-1.493a1.5 1.5 0 010-1.506l.995-1.493L4.01 6.75l2.225-.016a1.867 1.867 0 011.765 1.076l.22 .439a.868.868 0 001.54 0l.22-.44a1.867 1.867 0 011.766-1.076l2.224.016L19.99 9.25l.995 1.493a1.5 1.5 0 010 1.506l-.995 1.493-1.755 2.984-2.225.016a1.867 1.867 0 01-1.765-1.076l-.22-.439a.868.868 0 00-1.54 0l-.22.44a1.867 1.867 0 01-1.766-1.076l-2.224-.016L2.25 12.75Z" /></svg>}
            label="Carbon"
            value={`${product.carbonFootprint} kg CO₂e`}
          />
          <SustainabilityFeature 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183 M16.023 9.348V5.25A2.25 2.25 0 0 0 13.773 3H10.227a2.25 2.25 0 0 0-2.25 2.25v4.098M3.75 10.5V12m0 0V13.5m0-1.5H2.25m1.5 0H5.25m0 0V10.5m0 1.5V13.5m0 0H3.75M21.75 10.5V12m0 0V13.5m0-1.5H2.025m1.5 0H18.75m0 0V10.5m0 1.5V13.5m0 0H21.75M12 18.75a.75.75 0 0 0 .75-.75V16.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 .75.75Zm-.025-11.25a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75Zm0 0H12m0 0V6.75m0 0H12m0 0V5.25m0 0H12m0 0V3.75m0 0H12m0 0V2.25m0 0H12" /></svg>}
            label="Materials"
            value={product.materials.slice(0,2).join(', ') + (product.materials.length > 2 ? '...' : '')}
          />
           <SustainabilityFeature 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>}
            label="Health"
            score={product.healthImpactScore}
          />
          <SustainabilityFeature 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.495-2.495a1.762 1.762 0 0 1 2.495 0L21 12.238M11.42 15.17l-2.495 2.495a1.762 1.762 0 0 1-2.495 0L3 12.238M11.42 15.17l2.495 2.495M3.507 11.42H3m18 0h-.507M12.238 3V3.507M12.238 21v-.507M3.507 12.58l-.507.507M11.42 3.507l.507-.507M12.58 3.507l-.507.507M20.493 11.42l.507.507M12.238 12.238l-.507-.507M11.42 20.493l.507.507M12.58 20.493l-.507-.507M20.493 12.58l.507-.507" /></svg>}
            label="Durability"
            score={product.durabilityScore}
          />
          <SustainabilityFeature 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 17.25V11.25" /></svg>}
            label="Packaging"
            score={product.packagingScore}
          />
        </div>

        <p className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">${product.price.toFixed(2)}</p>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 h-10 overflow-hidden">
          {product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''}
        </p>

        <div className="mt-auto space-y-2">
          <button
            onClick={() => onViewDetails(product)}
            className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 text-xs flex items-center justify-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View Details
          </button>
          <button
            onClick={handleAddToCartClick}
            className="w-full bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-900 font-medium py-2 px-3 rounded-md transition duration-150 text-xs flex items-center justify-center shadow-sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
      {showShippingChoice && (
        <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10">
          <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Choose Shipping Type:</p>
          <div className="flex items-center mb-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mr-1">How does it work?</p>
            <ShippingOptionsPopover>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-sky-500 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </ShippingOptionsPopover>
          </div>
          <button 
            onClick={() => handleSelectShipping(CartType.GROUP_BUY)}
            className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-slate-800 dark:text-slate-900 font-medium py-2 px-4 rounded-lg mb-2 text-sm shadow-sm"
          >
            Add to Group Buy
          </button>
          <button 
            onClick={() => handleSelectShipping(CartType.INDIVIDUAL)}
            className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg text-sm shadow-sm"
          >
            Add to Individual Cart
          </button>
          <button 
            onClick={() => setShowShippingChoice(false)}
            className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
