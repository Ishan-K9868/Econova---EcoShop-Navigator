
import React, { useEffect, useRef } from 'react';
import { CartItem, CartType } from '../types';
import { DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupBuyItems: CartItem[];
  individualItems: CartItem[];
  onRemoveItem: (productId: string, cartType: CartType) => void;
  onUpdateQuantity: (productId: string, quantity: number, cartType: CartType) => void;
  onProceedToCheckout: () => void; 
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  groupBuyItems,
  individualItems,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout, 
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculateCartSection = (items: CartItem[], cartType: CartType) => {
    const totalOriginalCarbon = items.reduce((sum, item) => sum + item.carbonFootprint * item.quantity, 0);
    let co2Saved = 0;
    if (cartType === CartType.GROUP_BUY) {
      co2Saved = (totalOriginalCarbon * DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE) / 100;
    }
    const totalCartCarbon = totalOriginalCarbon - co2Saved;
    const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return { totalOriginalCarbon, co2Saved, totalCartCarbon, totalCost, totalItems };
  };

  const groupBuyData = calculateCartSection(groupBuyItems, CartType.GROUP_BUY);
  const individualData = calculateCartSection(individualItems, CartType.INDIVIDUAL);

  const renderCartItems = (items: CartItem[], cartType: CartType) => (
    <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
      {items.map((item) => (
        <li key={`${item.id}-${cartType}`} className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-slate-200 dark:border-slate-600">
          <div className="flex items-center">
            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{item.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">${item.price.toFixed(2)} ea.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1, cartType)}
              className="w-14 text-center border border-slate-300 dark:border-slate-500 rounded p-1 text-sm bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400"
              aria-label={`Quantity for ${item.name}`}
            />
            <button onClick={() => onRemoveItem(item.id, cartType)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" aria-label={`Remove ${item.name}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[70] p-4 transition-opacity duration-300">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          aria-label="Close cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2 text-sky-600 dark:text-sky-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Your Shopping Cart
        </h2>

        <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Group Buy Items ({groupBuyData.totalItems})</h3>
          {groupBuyItems.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No items in your group buy cart.</p>
          ) : (
            <>
              {renderCartItems(groupBuyItems, CartType.GROUP_BUY)}
              <div className="text-sm space-y-1 mt-2">
                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Subtotal:</span> <span className="font-medium text-slate-800 dark:text-slate-100">${groupBuyData.totalCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-600 dark:text-green-400"><span >Original CO₂:</span> <span className="font-medium">{groupBuyData.totalOriginalCarbon.toFixed(2)} kg</span></div>
                <div className="flex justify-between text-green-500 dark:text-green-300"><span >CO₂ Saved (Group):</span> <span className="font-medium">-{groupBuyData.co2Saved.toFixed(2)} kg</span></div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 pt-1 border-t border-slate-200 dark:border-slate-600"><span >Group Buy Est. CO₂:</span> <span >{groupBuyData.totalCartCarbon.toFixed(2)} kg</span></div>
              </div>
            </>
          )}
        </div>

        <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Individual Shipment Items ({individualData.totalItems})</h3>
          {individualItems.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No items for individual shipment.</p>
          ) : (
            <>
              {renderCartItems(individualItems, CartType.INDIVIDUAL)}
               <div className="text-sm space-y-1 mt-2">
                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-300">Subtotal:</span> <span className="font-medium text-slate-800 dark:text-slate-100">${individualData.totalCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200"><span >Est. CO₂ Footprint:</span> <span >{individualData.totalCartCarbon.toFixed(2)} kg</span></div>
              </div>
            </>
          )}
        </div>
        
        {(groupBuyItems.length > 0 || individualItems.length > 0) && (
            <button 
              onClick={onProceedToCheckout} 
              className="w-full bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-900 font-semibold py-3 px-4 rounded-md transition duration-150 text-sm shadow-sm hover:shadow-md"
            >
             Proceed to Checkout (Simulated)
            </button>
        )}
         <button 
            onClick={onClose}
            className="mt-3 w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-md transition duration-150 text-sm shadow-sm"
        >
            Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartModal;
