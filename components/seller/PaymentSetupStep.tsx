
import React from 'react';
import { PaymentSetupData } from '../../types';

interface PaymentSetupStepProps {
  data: PaymentSetupData;
  onDataChange: (field: keyof PaymentSetupData, value: string | boolean | number | undefined) => void;
}

const PaymentSetupStep: React.FC<PaymentSetupStepProps> = ({ data, onDataChange }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      onDataChange(name as keyof PaymentSetupData, (e.target as HTMLInputElement).checked);
    } else if (type === 'number') {
      // Allow clearing the number field, which should result in `undefined`
      onDataChange(name as keyof PaymentSetupData, value === '' ? undefined : parseFloat(value));
    } else {
      onDataChange(name as keyof PaymentSetupData, value);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Set up how you'll receive payments for your sales and manage tax settings. 
        <strong className="text-orange-500"> (This is for UI demonstration only. No real data is processed or stored.)</strong>
      </p>

      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Preferred Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          name="paymentMethod"
          id="paymentMethod"
          value={data.paymentMethod || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
        >
          <option value="" disabled>Select method...</option>
          <option value="bank_transfer">Bank Transfer (Simulated)</option>
          <option value="paypal">PayPal (Simulated)</option>
          <option value="stripe">Stripe Connect (Simulated)</option>
        </select>
      </div>

      {data.paymentMethod === 'bank_transfer' && (
        <>
          <div>
            <label htmlFor="bankAccountName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bank Account Holder Name
            </label>
            <input
              type="text"
              name="bankAccountName"
              id="bankAccountName"
              value={data.bankAccountName || ''}
              onChange={handleInputChange}
              placeholder="Full Name as on Bank Account"
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bank Account Number (Simulated)
            </label>
            <input
              type="text" 
              name="bankAccountNumber"
              id="bankAccountNumber"
              value={data.bankAccountNumber || ''}
              onChange={handleInputChange}
              placeholder="Enter account number"
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>
           <div>
            <label htmlFor="routingNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Routing Number (Simulated)
            </label>
            <input
              type="text" 
              name="routingNumber"
              id="routingNumber"
              value={data.routingNumber || ''}
              onChange={handleInputChange}
              placeholder="Enter routing number"
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>
        </>
      )}
      
      {/* Basic Tax Settings Example */}
       <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
         <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Tax Information (Simulated)</h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="taxExempt"
              id="taxExempt"
              checked={data.taxExempt || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-sky-600 border-slate-300 dark:border-slate-500 rounded focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700"
            />
            <label htmlFor="taxExempt" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
              I am tax exempt.
            </label>
          </div>
          {!data.taxExempt && (
             <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 mt-2">
                Default Sales Tax Rate (%) (if applicable)
                </label>
                <input
                type="number"
                name="taxRate"
                id="taxRate"
                value={data.taxRate === undefined ? '' : data.taxRate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 7.5"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                />
            </div>
          )}
      </div>
    </div>
  );
};

export default PaymentSetupStep;
