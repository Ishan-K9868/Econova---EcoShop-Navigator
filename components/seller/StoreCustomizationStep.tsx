
import React, { useState, useCallback, useEffect } from 'react';
import { StoreCustomizationData } from '../../types';

interface StoreCustomizationStepProps {
  data: StoreCustomizationData;
  onDataChange: (field: keyof StoreCustomizationData, value: string | File | null) => void;
}

const StoreCustomizationStep: React.FC<StoreCustomizationStepProps> = ({ data, onDataChange }) => {
  const [logoPreviewLocal, setLogoPreviewLocal] = useState<string | null>(data.storeLogoPreview || null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange(e.target.name as keyof StoreCustomizationData, e.target.value);
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG, JPG, WEBP).');
        event.target.value = "";
        onDataChange('storeLogo', null);
        onDataChange('storeLogoPreview', null); 
        setLogoPreviewLocal(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Logo file is too large. Max 2MB.');
        event.target.value = "";
        onDataChange('storeLogo', null);
        onDataChange('storeLogoPreview', null);
        setLogoPreviewLocal(null);
        return;
      }
      onDataChange('storeLogo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreviewLocal(result);
        onDataChange('storeLogoPreview', result); 
      };
      reader.readAsDataURL(file);
    } else {
      onDataChange('storeLogo', null);
      onDataChange('storeLogoPreview', null);
      setLogoPreviewLocal(null);
    }
  }, [onDataChange]);

  useEffect(() => {
    setLogoPreviewLocal(data.storeLogoPreview || null);
  }, [data.storeLogoPreview]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Personalize your seller profile. This information will be visible to customers.
        <strong className="text-orange-500"> (UI Only for this demo)</strong>
      </p>
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Store Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="storeName"
          id="storeName"
          value={data.storeName || ''}
          onChange={handleTextChange}
          required
          maxLength={50}
          placeholder="Your Eco Store Name"
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="storeDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Store Description (Short - max 150 characters) <span className="text-red-500">*</span>
        </label>
        <textarea
          name="storeDescription"
          id="storeDescription"
          value={data.storeDescription || ''}
          onChange={handleTextChange}
          rows={3}
          required
          maxLength={150}
          placeholder="Briefly describe your store and its mission."
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="storeLogo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Store Logo (Optional, Max 2MB - PNG, JPG, WEBP)
        </label>
        <input
          type="file"
          name="storeLogo"
          id="storeLogo"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200 hover:file:bg-sky-100 dark:hover:file:bg-sky-600 transition"
        />
        {logoPreviewLocal && (
          <div className="mt-2 flex items-start space-x-2">
            <img src={logoPreviewLocal} alt="Store Logo Preview" className="max-h-24 border rounded-md p-1 dark:bg-slate-600 object-contain" />
            <button
                type="button"
                onClick={() => {
                    onDataChange('storeLogo', null);
                    onDataChange('storeLogoPreview', null);
                    setLogoPreviewLocal(null);
                    const fileInput = document.getElementById('storeLogo') as HTMLInputElement;
                    if(fileInput) fileInput.value = "";
                }}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 bg-white dark:bg-slate-700 rounded-full shadow"
                aria-label="Remove logo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCustomizationStep;
