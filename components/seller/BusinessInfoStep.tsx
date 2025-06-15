
import React from 'react';
import { BusinessInfoData } from '../../types';

interface BusinessInfoStepProps {
  data: BusinessInfoData;
  onDataChange: (field: keyof BusinessInfoData, value: string) => void;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ data, onDataChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onDataChange(e.target.name as keyof BusinessInfoData, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="businessName"
          id="businessName"
          value={data.businessName || ''}
          onChange={handleChange}
          required
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
          placeholder="Your Company LLC"
        />
      </div>

      <div>
        <label htmlFor="legalName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Legal Name (if different)
        </label>
        <input
          type="text"
          name="legalName"
          id="legalName"
          value={data.legalName || ''}
          onChange={handleChange}
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          name="businessType"
          id="businessType"
          value={data.businessType || ''}
          onChange={handleChange}
          required
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        >
          <option value="" disabled>Select type...</option>
          <option value="individual">Individual / Sole Proprietor</option>
          <option value="small_business">Small Business</option>
          <option value="corporation">Corporation</option>
          <option value="nonprofit">Non-Profit</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="registrationNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Business Registration Number (Optional)
        </label>
        <input
          type="text"
          name="registrationNumber"
          id="registrationNumber"
          value={data.registrationNumber || ''}
          onChange={handleChange}
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="taxId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tax ID / EIN <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="taxId"
          id="taxId"
          value={data.taxId || ''}
          onChange={handleChange}
          required
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="foundedDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Founded Date (Optional)
        </label>
        <input
          type="date"
          name="foundedDate"
          id="foundedDate"
          value={data.foundedDate || ''}
          onChange={handleChange}
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>
    </div>
  );
};

export default BusinessInfoStep;
