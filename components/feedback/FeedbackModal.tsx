import React, { useState, useEffect, useRef } from 'react';
import { FeedbackContextData, FeedbackCategoryName, FeedbackSeverity, ClientFeedbackSubmission } from '../../types';
import { FEEDBACK_CATEGORIES } from '../../constants';
import FeedbackRewards from './FeedbackRewards';
import LoadingSpinner from '../LoadingSpinner'; // Assuming you have this

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: ClientFeedbackSubmission) => void;
  contextData?: FeedbackContextData;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, contextData }) => {
  const [category, setCategory] = useState<FeedbackCategoryName | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<FeedbackSeverity>(3);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [expectedCoins, setExpectedCoins] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setCategory('');
      setTitle('');
      setDescription('');
      setSeverity(3);
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setExpectedCoins(0);
      setIsSubmitting(false);
      // Pre-fill from context if available
      if (contextData?.productId) setTitle(`Feedback for product ID: ${contextData.productId}`);
      if (contextData?.page) setDescription(`Issue on page: ${contextData.page}\nAction: ${contextData.userAction || 'N/A'}\n\n`);
    }
  }, [isOpen, contextData]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for preview
        alert('File is too large. Max 2MB for screenshots.');
        setScreenshotFile(null);
        setScreenshotPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotFile(null);
      setScreenshotPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title.trim() || !description.trim()) {
      alert('Please fill in category, title, and description.');
      return;
    }
    setIsSubmitting(true);

    const submission: ClientFeedbackSubmission = {
      id: `feedback-${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim(),
      severity,
      context: contextData,
      screenshot: screenshotFile || undefined,
      screenshotPreview: screenshotPreview || undefined,
      coinsAwarded: expectedCoins,
      submissionDate: new Date(),
    };
    
    // Simulate submission delay
    setTimeout(() => {
        onSubmit(submission);
        setIsSubmitting(false);
        onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const severityLabels: Record<FeedbackSeverity, string> = {
    1: 'Minor / Cosmetic',
    2: 'Low Impact / Annoyance',
    3: 'Moderate Impact / Functional Issue',
    4: 'High Impact / Prevents Use',
    5: 'Critical / Data Loss / Security',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.75 6a7.5 7.5 0 0 1 15 0v3a7.5 7.5 0 0 1-7.5 7.5S3.75 12 3.75 9V6Zm4.5-3.75A2.25 2.25 0 0 1 10.5 0h3a2.25 2.25 0 0 1 2.25 2.25V6H8.25V2.25Z" />
            </svg>
            Provide Feedback
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label htmlFor="feedbackCategory" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category <span className="text-red-500">*</span></label>
            <select
              id="feedbackCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as FeedbackCategoryName | '')}
              required
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            >
              <option value="" disabled>Select a category...</option>
              {Object.entries(FEEDBACK_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="feedbackTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="feedbackTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="A brief summary of your feedback"
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="feedbackDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              id="feedbackDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              maxLength={1000}
              placeholder="Please provide details..."
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="feedbackSeverity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
            <select
              id="feedbackSeverity"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value, 10) as FeedbackSeverity)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            >
              {(Object.keys(severityLabels) as unknown as FeedbackSeverity[]).sort((a,b) => b-a).map((sevValue) => (
                <option key={sevValue} value={sevValue}>{sevValue} - {severityLabels[sevValue]}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="feedbackScreenshot" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attach Screenshot (Optional, Max 2MB)</label>
            <input
              type="file"
              id="feedbackScreenshot"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 dark:text-slate-400
                file:mr-4 file:py-2 file:px-3
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200
                hover:file:bg-sky-100 dark:hover:file:bg-sky-600 transition"
            />
            {screenshotPreview && (
              <div className="mt-2 border border-slate-300 dark:border-slate-600 rounded-md p-2 inline-block">
                <img src={screenshotPreview} alt="Screenshot preview" className="max-h-32 rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setScreenshotFile(null);
                    setScreenshotPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="mt-1 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove screenshot
                </button>
              </div>
            )}
          </div>

          <FeedbackRewards
            selectedCategory={category}
            selectedSeverity={severity}
            includeScreenshot={!!screenshotFile}
            onExpectedCoinsChange={setExpectedCoins}
          />
        
        </form>
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            form="feedback-form" // This should match the form's id if you give it one, or just rely on it being the default submit button for the form it's inside
            onClick={handleSubmit} // Added onClick here because the button is outside the form tag in this structure
            disabled={isSubmitting || !category || !title.trim() || !description.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-md"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" text="Submitting..." />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.704 5.704 0 0 1 .834 5.04M4.5 15.75A2.25 2.25 0 0 1 6.75 18h10.5a2.25 2.25 0 0 1 2.25-2.25" />
                </svg>
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
