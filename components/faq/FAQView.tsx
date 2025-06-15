
import React, { useState } from 'react';
import { FAQItem } from '../../types';

interface FAQViewProps {
  faqData: FAQItem[];
  onGoHome: () => void;
}

const FAQView: React.FC<FAQViewProps> = ({ faqData, onGoHome }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <button
            onClick={onGoHome}
            className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 text-sm shadow-sm"
          >
            Back to Home
          </button>
        </div>

        {faqData.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No FAQs available at the moment. Please check back later.
          </p>
        ) : (
          <div className="space-y-4">
            {faqData.map((item) => (
              <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                  aria-expanded={openAccordion === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="text-md font-medium text-slate-700 dark:text-slate-200">{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 text-slate-500 dark:text-slate-400 transform transition-transform duration-200 ${
                      openAccordion === item.id ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openAccordion === item.id && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="p-4 sm:p-5 bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQView;
