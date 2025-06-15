
import React, { useState, useRef } from 'react';
import { analyzeProductUrl, analyzeProductImage } from '../services/geminiService';
import { ExternalAnalysisResult, AlertType } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SustainabilityAnalysisCard from './SustainabilityAnalysisCard';

interface ExternalProductAnalyzerProps {
  addAlert: (message: string, type: AlertType) => void;
  isGeminiAvailable: boolean;
  onAnalysisComplete: (result: ExternalAnalysisResult) => void; // For history
}

const ExternalProductAnalyzer: React.FC<ExternalProductAnalyzerProps> = ({ addAlert, isGeminiAvailable, onAnalysisComplete }) => {
  const [url, setUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ExternalAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim()) {
      setError('Please enter a product URL.');
      addAlert('Product URL cannot be empty.', AlertType.ERROR);
      return;
    }
    if (!isGeminiAvailable) {
        setError('AI analysis service is currently unavailable. Cannot analyze URL.');
        // addAlert('AI analysis service is unavailable.', AlertType.ERROR); // Popup removed
        return;
    }

    setIsLoadingUrl(true);
    setError(null);
    setAnalysisResult(null);
    // addAlert(`Analyzing URL: ${url}... This may take a moment.`, AlertType.INFO); // Popup removed

    try {
      new URL(url); 
      const result = await analyzeProductUrl(url);
      if (result) {
        setAnalysisResult(result);
        onAnalysisComplete(result);
        // addAlert(`Successfully analyzed URL for: ${result.productName}`, AlertType.SUCCESS); // Popup removed
      } else {
        setError('Could not retrieve analysis for this URL. The AI might not have been able to process the request, or the response was not in the expected format.');
        addAlert('Failed to get analysis for URL. Please try a different URL or check the format.', AlertType.ERROR);
      }
    } catch (e) {
      console.error("URL Analysis Error:", e);
      let errorMessage = 'An error occurred during URL analysis.';
      if (e instanceof TypeError && e.message.includes("Invalid URL")) {
        errorMessage = 'The entered URL is not valid. Please check and try again.';
      } else if (e instanceof Error) {
        errorMessage = e.message.includes("format") ? 'AI response format error from URL analysis.' : 'Failed to analyze URL.';
      }
      setError(errorMessage);
      addAlert(errorMessage, AlertType.ERROR);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size (e.g., 4MB)
        setError('File size exceeds 4MB limit.');
        addAlert('File size exceeds 4MB limit. Please choose a smaller image.', AlertType.ERROR);
        setSelectedFile(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
        return;
      }
      setSelectedFile(file);
      setError(null); // Clear previous errors
      setAnalysisResult(null); // Clear previous results
    }
  };

  const handleImageSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image file to analyze.');
      addAlert('No image selected for analysis.', AlertType.ERROR);
      return;
    }
     if (!isGeminiAvailable) {
        setError('AI analysis service is currently unavailable. Cannot analyze image.');
        // addAlert('AI analysis service is unavailable.', AlertType.ERROR); // Popup removed
        return;
    }

    setIsLoadingImage(true);
    setError(null);
    setAnalysisResult(null);
    // addAlert(`Analyzing image: ${selectedFile.name}... This may take a moment.`, AlertType.INFO); // Popup removed

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const result = await analyzeProductImage(base64String, selectedFile.type, selectedFile.name);
          if (result) {
            setAnalysisResult(result);
            onAnalysisComplete(result);
            // addAlert(`Successfully analyzed image: ${result.productName}`, AlertType.SUCCESS); // Popup removed
          } else {
            setError('Could not retrieve analysis for this image. The AI might not have processed it correctly or the response format was unexpected.');
            addAlert('Failed to get analysis for image. Please try a different image.', AlertType.ERROR);
          }
        } else {
          setError('Could not read the image file.');
          addAlert('Error reading image file.', AlertType.ERROR);
        }
        setIsLoadingImage(false);
      };
      reader.onerror = () => {
        setError('Error reading image file.');
        addAlert('Error reading image file.', AlertType.ERROR);
        setIsLoadingImage(false);
      };
    } catch (e) {
      console.error("Image Analysis Error:", e);
      let errorMessage = 'An error occurred during image analysis.';
      if (e instanceof Error) {
        errorMessage = e.message.includes("format") ? 'AI response format error from image analysis.' : 'Failed to analyze image.';
      }
      setError(errorMessage);
      addAlert(errorMessage, AlertType.ERROR);
      setIsLoadingImage(false);
    }
  };


  return (
    <div className="py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Analyze External Product Sustainability</h2>
      
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* URL Analyzer */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Analyze by URL</h3>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label htmlFor="productUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product URL
              </label>
              <input
                type="url"
                id="productUrl"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
                placeholder="e.g., https://www.amazon.com/product"
                className="w-full p-3 border border-slate-400 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingUrl || !isGeminiAvailable}
              className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold py-3 px-5 rounded-md transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {isLoadingUrl ? <LoadingSpinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>}
              Analyze URL
            </button>
          </form>
        </div>

        {/* Image Analyzer */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Analyze by Image</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="productImage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Upload Product Image
              </label>
              <input
                type="file"
                id="productImage"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 dark:file:bg-sky-800 file:text-sky-700 dark:file:text-sky-300
                  hover:file:bg-sky-100 dark:hover:file:bg-sky-700
                  dark:file:border dark:file:border-slate-600 transition"
              />
              {selectedFile && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selected: {selectedFile.name}</p>}
            </div>
            <button
              onClick={handleImageSubmit}
              disabled={isLoadingImage || !selectedFile || !isGeminiAvailable}
              className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold py-3 px-5 rounded-md transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {isLoadingImage ? <LoadingSpinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
              Analyze Image
            </button>
          </div>
        </div>
      </div>
      
      {(!isGeminiAvailable && (isLoadingUrl || isLoadingImage)) && (
         <p className="text-sm text-center text-red-500 dark:text-red-400 mt-4">
            AI features are currently unavailable. Analysis is disabled.
        </p>
      )}


      {error && (
        <div className="mt-6 max-w-2xl mx-auto p-3 bg-red-100 dark:bg-red-700/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md">
          <p className="text-sm font-medium text-center">Error: {error}</p>
        </div>
      )}

      {analysisResult && <div className="max-w-2xl mx-auto"><SustainabilityAnalysisCard result={analysisResult} /></div>}

      <p className="mt-8 text-xs text-center text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
        This feature uses AI to estimate sustainability metrics for a generic product type based on the provided URL context or image content.
        Actual product details are not deeply scraped from URLs or perfectly identified from images in this client-side demonstration. Results are illustrative.
      </p>
    </div>
  );
};

export default ExternalProductAnalyzer;
