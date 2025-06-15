import React, { useState, useRef, useEffect } from 'react';
import { NewProductFormData } from '../../types';
import LoadingSpinner from '../LoadingSpinner'; // Added import

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: NewProductFormData) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const initialFormState: NewProductFormData = {
    name: '',
    description: '',
    category: '',
    price: 0,
    materials: '',
    carbonFootprint: 0,
    durabilityScore: 3,
    packagingScore: 3,
    healthImpactScore: 3,
    imageUrl: '',
  };
  const [formData, setFormData] = useState<NewProductFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState); // Reset form when modal opens
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image file is too large. Max 2MB.');
        event.target.value = "";
        setFormData(prev => ({ ...prev, imageFile: null, imageUrl: prev.imageUrl })); // Keep existing URL if file is invalid
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string, imageFile: file }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
        alert('Please upload a valid image file (PNG, JPG, WEBP).');
        event.target.value = "";
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <=0 || !formData.materials) {
        alert("Please fill in all required fields: Name, Category, Price, and Materials.");
        return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onAddProduct(formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Add New Product</h2>
          <button onClick={onClose} disabled={isLoading} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label htmlFor="name" className={labelClass}>Product Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description <span className="text-xs text-sky-500">(AI Suggestion Placeholder)</span></label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className={inputClass} placeholder="AI can help generate this based on name and materials." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Category <span className="text-red-500">*</span></label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="materials" className={labelClass}>Materials (comma-separated) <span className="text-red-500">*</span></label>
            <input type="text" name="materials" id="materials" value={formData.materials} onChange={handleChange} required className={inputClass} placeholder="e.g., Organic Cotton, Recycled PET" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="carbonFootprint" className={labelClass}>Est. Carbon Footprint (kg CO₂e)</label>
              <input type="number" name="carbonFootprint" id="carbonFootprint" value={formData.carbonFootprint} onChange={handleChange} min="0" step="0.1" className={inputClass} />
            </div>
             <div>
              <label htmlFor="imageUrl" className={labelClass}>Image URL (or Upload)</label>
              <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputClass} />
            </div>
          </div>
           <div>
            <label htmlFor="imageFile" className={labelClass}>Upload Image (Optional, Max 2MB)</label>
            <input type="file" name="imageFile" id="imageFile" accept="image/*" onChange={handleFileChange} className={`${inputClass} file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200 hover:file:bg-sky-100 dark:hover:file:bg-sky-600`} />
            {formData.imageUrl && formData.imageFile && <img src={formData.imageUrl} alt="Preview" className="mt-2 max-h-20 rounded"/>}
          </div>


          <p className={`${labelClass} mt-2`}>Sustainability Scores (1-5, 5 is best):</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="durabilityScore" className={labelClass}>Durability</label>
              <input type="number" name="durabilityScore" id="durabilityScore" value={formData.durabilityScore} onChange={handleChange} min="1" max="5" step="1" className={inputClass} />
            </div>
            <div>
              <label htmlFor="packagingScore" className={labelClass}>Packaging</label>
              <input type="number" name="packagingScore" id="packagingScore" value={formData.packagingScore} onChange={handleChange} min="1" max="5" step="1" className={inputClass} />
            </div>
            <div>
              <label htmlFor="healthImpactScore" className={labelClass}>Health Impact</label>
              <input type="number" name="healthImpactScore" id="healthImpactScore" value={formData.healthImpactScore} onChange={handleChange} min="1" max="5" step="1" className={inputClass} />
            </div>
          </div>
        </form>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || !formData.category || formData.price <=0 || !formData.materials}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-md"
          >
            {isLoading ? <LoadingSpinner size="sm" text="Adding..." /> : "Add Product to My Listings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;