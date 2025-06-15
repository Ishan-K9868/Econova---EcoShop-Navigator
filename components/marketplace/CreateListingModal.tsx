
import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceListing, MarketplaceCondition, AlertType } from '../../types';
import { MARKETPLACE_ITEM_CATEGORIES } from '../../constants';
import LoadingSpinner from '../LoadingSpinner';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listingData: Omit<MarketplaceListing, 'id' | 'userId' | 'listedDate' | 'status' | 'estimatedCo2Saved'> & { imageFiles?: File[] }) => void;
  isGeminiAvailable: boolean;
  addAlert: (message: string, type: AlertType) => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onAddListing, isGeminiAvailable, addAlert }) => {
  const initialFormState: Omit<MarketplaceListing, 'id' | 'userId' | 'listedDate' | 'status' | 'estimatedCo2Saved'> & { imageFiles?: File[] } = {
    title: '',
    description: '',
    category: MARKETPLACE_ITEM_CATEGORIES[0],
    condition: MarketplaceCondition.GOOD,
    price: 0,
    currency: 'EcoCoins',
    images: [], // Store base64 previews here for display
    imageFiles: [], // Store File objects here for potential upload
    location: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceType, setPriceType] = useState<'fixed' | 'trade'>('fixed');
  const modalContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setPriceType('fixed');
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // For now, only one image
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        addAlert("Image file is too large (max 2MB).", AlertType.ERROR);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFormData(prev => ({ ...prev, images: [], imageFiles: [] }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [reader.result as string], // Store base64 preview
          imageFiles: [file] // Store File object
        }));
      };
      reader.readAsDataURL(file);
    } else {
       setFormData(prev => ({ ...prev, images: [], imageFiles: [] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addAlert("Title and description are required.", AlertType.ERROR);
      return;
    }
    if (priceType === 'fixed' && Number(formData.price) <= 0) {
        addAlert("Price must be greater than zero for fixed price items.", AlertType.ERROR);
        return;
    }

    setIsSubmitting(true);
    
    const listingDataToSubmit = {
      ...formData,
      price: priceType === 'trade' ? 'Trade' : formData.price,
      currency: priceType === 'trade' ? 'Trade' : formData.currency,
    };

    // Simulate submission delay
    setTimeout(() => {
      onAddListing(listingDataToSubmit);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">List an Item on Marketplace</h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label htmlFor="title" className={labelClass}>Item Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description <span className="text-red-500">*</span></label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className={inputClass} />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="category" className={labelClass}>Category</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClass}>
                {MARKETPLACE_ITEM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="condition" className={labelClass}>Condition</label>
                <select name="condition" id="condition" value={formData.condition} onChange={handleChange} className={inputClass}>
                {Object.values(MarketplaceCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Price Type</label>
            <div className="flex space-x-4">
                <label className="flex items-center">
                    <input type="radio" name="priceType" value="fixed" checked={priceType === 'fixed'} onChange={() => setPriceType('fixed')} className="form-radio text-sky-600 dark:bg-slate-600"/>
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Fixed Price</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="priceType" value="trade" checked={priceType === 'trade'} onChange={() => setPriceType('trade')} className="form-radio text-purple-600 dark:bg-slate-600"/>
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Trade Only</span>
                </label>
            </div>
          </div>

          {priceType === 'fixed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className={labelClass}>Price <span className="text-red-500">*</span></label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="currency" className={labelClass}>Currency</label>
                    <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className={inputClass}>
                        <option value="EcoCoins">EcoCoins</option>
                        <option value="USD_SIMULATED">USD (Simulated)</option>
                    </select>
                </div>
            </div>
          )}
           <div>
            <label htmlFor="imageFile" className={labelClass}>Item Image (Max 2MB)</label>
            <input type="file" name="imageFile" id="imageFile" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className={`${inputClass} file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200 hover:file:bg-sky-100 dark:hover:file:bg-sky-600`} />
            {formData.images && formData.images[0] && <img src={formData.images[0]} alt="Preview" className="mt-2 max-h-32 rounded border border-slate-300 dark:border-slate-600"/>}
          </div>
           <div>
            <label htmlFor="location" className={labelClass}>Location (Optional)</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder="e.g., City, State" className={inputClass} />
          </div>
        </form>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || (priceType ==='fixed' && Number(formData.price) <= 0)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-md"
          >
            {isSubmitting ? <LoadingSpinner size="sm" text="Listing Item..." /> : "List Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
