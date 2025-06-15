
import React from 'react';
import { SustainabilityProfileData } from '../../types';

interface SustainabilityProfileStepProps {
  data: SustainabilityProfileData;
  onDataChange: (field: keyof SustainabilityProfileData, value: string) => void;
}

const SustainabilityProfileStep: React.FC<SustainabilityProfileStepProps> = ({ data, onDataChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange(e.target.name as keyof SustainabilityProfileData, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="certifications" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Sustainability Certifications (e.g., GOTS, Fair Trade, B-Corp - comma separated)
        </label>
        <input
          type="text"
          name="certifications"
          id="certifications"
          value={data.certifications || ''}
          onChange={handleChange}
          placeholder="GOTS Certified Organic, B-Corp Certified"
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="sustainabilityPractices" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Describe Your Key Sustainability Practices <span className="text-red-500">*</span>
        </label>
        <textarea
          name="sustainabilityPractices"
          id="sustainabilityPractices"
          value={data.sustainabilityPractices || ''}
          onChange={handleChange}
          rows={4}
          required
          placeholder="e.g., Use of renewable energy, water conservation methods, waste reduction programs, ethical sourcing..."
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="ecoCommitmentStatement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Your Eco-Commitment Statement (Optional, max 200 words)
        </label>
        <textarea
          name="ecoCommitmentStatement"
          id="ecoCommitmentStatement"
          value={data.ecoCommitmentStatement || ''}
          onChange={handleChange}
          rows={3}
          maxLength={1000} // ~200 words
          placeholder="Share your business's vision for a sustainable future."
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>
       <p className="text-xs text-slate-500 dark:text-slate-400">
        Be specific! Highlighting genuine eco-efforts can attract more customers and improve your platform visibility.
      </p>
    </div>
  );
};

export default SustainabilityProfileStep;
