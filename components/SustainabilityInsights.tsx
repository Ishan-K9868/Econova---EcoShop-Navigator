
import React, { useState, useCallback, useEffect } from 'react';
import { getEcoTip, isGeminiAvailable as checkGeminiAvailable } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const SustainabilityInsights: React.FC = () => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean>(true); 

  const fetchTip = useCallback(async () => {
    setIsLoading(true);
    const newTip = await getEcoTip();
    setTip(newTip);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setGeminiAvailable(checkGeminiAvailable());
    if (checkGeminiAvailable()) {
        fetchTip(); 
    } else {
        setTip("Eco-Tip: AI insights are currently unavailable. Remember to reduce, reuse, and recycle!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="bg-sky-50 dark:bg-sky-900/50 p-6 rounded-lg shadow-md my-8 border border-sky-200 dark:border-sky-800">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-600 dark:text-sky-400 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.354a15.055 15.055 0 0 1-4.5 0M3 16.5v-1.5M3 12V9M12 2.25V4.5m0-4.5v1.5m6.75 3.75l-1.06-1.06M21 12h-1.5m-15 0H3m16.5 0h1.5M12 21.75V19.5M4.22 4.22l1.06 1.06M18.78 4.22l-1.06 1.06M18.78 19.78l-1.06-1.06M4.22 19.78l1.06-1.06M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <h3 className="text-2xl font-semibold text-sky-700 dark:text-sky-300">Eco-Tip Corner</h3>
      </div>
      {isLoading ? (
        <LoadingSpinner text="Fetching your daily eco-tip..." />
      ) : (
        <p className="text-sky-800 dark:text-sky-200 italic text-center text-lg leading-relaxed">"{tip}"</p>
      )}
      {geminiAvailable && (
        <button
          onClick={fetchTip}
          disabled={isLoading}
          className="mt-6 w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-150 disabled:opacity-50 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.250L16.023 9.348M3.75 21V9h4.992V5.25A2.25 2.25 0 0 1 10.992 3h4.016a2.25 2.25 0 0 1 2.25 2.25v3.75h4.992v12h-4.992V15H8.742v6H3.75Z" />
          </svg>
          Get Another Tip
        </button>
      )}
    </div>
  );
};

export default SustainabilityInsights;