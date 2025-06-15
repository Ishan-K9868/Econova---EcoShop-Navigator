
import React, { useState, useRef } from 'react';
import { BarcodeAnalysisResult, AlertType } from '../../types';
import { analyzeProductImageForBarcodeSimulation, isGeminiAvailable as checkGeminiAvailable } from '../../services/geminiService';
import LoadingSpinner from '../LoadingSpinner';

interface BarcodeScannerMockupProps {
  onScanResult: (result: BarcodeAnalysisResult) => void;
  addAlert: (message: string, type: AlertType) => void;
}

const BarcodeScannerMockup: React.FC<BarcodeScannerMockupProps> = ({ onScanResult, addAlert }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addAlert('Invalid file type. Please upload an image (PNG, JPG, WEBP).', AlertType.ERROR);
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        addAlert('File size exceeds 4MB. Please choose a smaller image.', AlertType.ERROR);
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSimulateScan = async () => {
    if (!selectedFile) {
      addAlert("Please select an image of a product to 'scan'.", AlertType.ERROR);
      return;
    }
    if (!checkGeminiAvailable()) {
      // addAlert("AI analysis service is unavailable. Cannot process image.", AlertType.ERROR); // Popup removed
      return;
    }

    setIsScanning(true);
    // addAlert(`Analyzing product image: ${selectedFile.name}...`, AlertType.INFO); // Popup removed

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const result = await analyzeProductImageForBarcodeSimulation(base64String, selectedFile.type, selectedFile.name, reader.result as string);
          if (result) {
            onScanResult(result);
            // addAlert(`Analysis complete for ${result.productName}. Simulated barcode: ${result.simulatedBarcode}`, AlertType.SUCCESS); // Popup removed
          } else {
            addAlert('AI could not analyze the image or the response was invalid.', AlertType.ERROR);
          }
        } else {
          addAlert('Could not read image file for analysis.', AlertType.ERROR);
        }
        setIsScanning(false);
        setSelectedFile(null); 
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.onerror = () => {
        addAlert('Error reading image file.', AlertType.ERROR);
        setIsScanning(false);
      };
    } catch (error) {
        console.error("Error in handleSimulateScan:", error);
        addAlert('An unexpected error occurred during image analysis.', AlertType.ERROR);
        setIsScanning(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Scan Product Image (AI Sim)</h3>
      
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center mb-4 border-2 border-dashed border-slate-400 dark:border-slate-500 overflow-hidden">
        {isScanning && <LoadingSpinner text="Analyzing image..." />}
        {!isScanning && imagePreview && <img src={imagePreview} alt="Selected product" className="max-h-full max-w-full object-contain" />}
        {!isScanning && !imagePreview && <p className="text-slate-500 dark:text-slate-400 text-sm p-2">Upload an image of a product to simulate barcode scanning and analysis.</p>}
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200
                  hover:file:bg-sky-100 dark:hover:file:bg-sky-600 mb-4 transition"
        disabled={isScanning}
      />

      <button 
        onClick={handleSimulateScan} 
        disabled={isScanning || !selectedFile || !checkGeminiAvailable()}
        className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150 disabled:opacity-60 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
        </svg>
        Analyze Product Image
      </button>
      {!checkGeminiAvailable() && <p className="text-xs text-orange-500 dark:text-orange-400 mt-2">AI Service is unavailable. Image analysis disabled.</p>}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">AI identifies the product, estimates sustainability, and generates a mock barcode.</p>
    </div>
  );
};

export default BarcodeScannerMockup;
