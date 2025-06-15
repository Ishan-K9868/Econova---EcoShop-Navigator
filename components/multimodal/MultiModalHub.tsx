
import React, { useState, ReactNode } from 'react';
import BarcodeScannerMockup from './BarcodeScannerMockup';
import VoiceSearchMockup from './VoiceSearchMockup';
import { BarcodeAnalysisResult, VoiceCommandInterpretation, AlertType, ExternalAnalysisResult, AppViewType } from '../../types'; // Updated imports
import SearchSuggestions from '../SearchSuggestions'; // Import for text search tab

// Define the specific navigation targets MultiModalHub can request
type MultiModalNavTarget = AppViewType | 'cart' | 'dashboard' | 'wallet';

interface MultiModalHubProps {
  // Props for Text Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
  showSearchSuggestions: boolean;
  setShowSearchSuggestions: (show: boolean) => void;
  SearchSuggestionsComponent: typeof SearchSuggestions;
  onSuggestionClick: (suggestion: string) => void;
  predefinedSearchSuggestions: string[];
  isLoadingProducts: boolean; 
  // General Props
  isGeminiAvailable: boolean; 
  addAlert: (message: string, type: AlertType) => void;
  // New prop to handle analysis results that should go to history (like barcode scan)
  onExternalAnalysisComplete: (result: ExternalAnalysisResult | BarcodeAnalysisResult) => void;
  // Updated onNavigate prop type
  onNavigate?: (view: MultiModalNavTarget) => void;
  // New prop to trigger eco tip display
  onGetEcoTip?: () => void;
}

type ActiveInputMethod = 'text' | 'barcode' | 'voice';

const MultiModalHub: React.FC<MultiModalHubProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  showSearchSuggestions,
  setShowSearchSuggestions,
  SearchSuggestionsComponent,
  onSuggestionClick,
  predefinedSearchSuggestions,
  isLoadingProducts,
  isGeminiAvailable,
  addAlert,
  onExternalAnalysisComplete,
  onNavigate,
  onGetEcoTip
}) => {
  const [activeInput, setActiveInput] = useState<ActiveInputMethod>('text');

  const handleBarcodeAnalysis = (result: BarcodeAnalysisResult) => {
    addAlert(result.message || `Product: ${result.productName}, Barcode (Sim): ${result.simulatedBarcode}`, AlertType.SUCCESS);
    
    // Add to analysis history if it's structured like ExternalAnalysisResult
    onExternalAnalysisComplete(result);

    if (result.productName) {
        setSearchTerm(result.productName); 
        onSearch(result.productName); 
        setActiveInput('text'); 
    }
  };

  const handleVoiceCommandInterpretation = (interpretation: VoiceCommandInterpretation) => {
    addAlert(`AI interpreted: ${interpretation.action} for "${interpretation.originalTranscript}"`, AlertType.INFO);

    switch (interpretation.action) {
      case 'search_products':
        if (interpretation.parameters.query) {
          setSearchTerm(interpretation.parameters.query);
          onSearch(interpretation.parameters.query);
          setActiveInput('text');
        } else {
          addAlert("AI understood search, but no query was extracted.", AlertType.INFO);
        }
        break;
      case 'analyze_product_by_name':
        if (interpretation.parameters.productName) {
          addAlert(`Voice command to analyze: "${interpretation.parameters.productName}". You can search for it or use the dedicated 'Analyze Product' feature.`, AlertType.INFO);
          setSearchTerm(interpretation.parameters.productName); // Pre-fill search
          onSearch(interpretation.parameters.productName); // Perform a search for now
          setActiveInput('text');
        } else {
          addAlert("AI understood analyze, but no product name was extracted.", AlertType.INFO);
        }
        break;
      case 'get_eco_tip':
        if (onGetEcoTip) {
          onGetEcoTip(); // Call the passed handler to display a tip
        } else {
           addAlert("Let me fetch an eco tip for you! (Feature to display tip here needs wiring)", AlertType.INFO);
        }
        break;
      case 'navigate_to_section':
        if (interpretation.parameters.sectionName && onNavigate) {
            onNavigate(interpretation.parameters.sectionName);
        } else {
            addAlert(`Navigation to "${interpretation.parameters.sectionName}" understood, but action not fully wired.`, AlertType.INFO);
        }
        break;
      case 'unknown_intent':
      default:
        addAlert(`AI could not determine a clear action for: "${interpretation.originalTranscript}"`, AlertType.INFO);
        break;
    }
  };
  
  const tabCommonStyle = "flex-1 py-2.5 px-3 text-xs sm:text-sm font-medium text-center rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
  const activeTabStyle = "bg-sky-600 text-white shadow-md focus:ring-sky-500 dark:focus:ring-sky-400";
  const inactiveTabStyle = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-sky-500 dark:focus:ring-sky-400";


  return (
    <div className="w-full">
      <div className="mb-3 flex space-x-1 sm:space-x-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <button 
            onClick={() => setActiveInput('text')} 
            className={`${tabCommonStyle} ${activeInput === 'text' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeInput === 'text'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-1.5 align-text-bottom"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          Text
        </button>
        <button 
            onClick={() => setActiveInput('barcode')} 
            className={`${tabCommonStyle} ${activeInput === 'barcode' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeInput === 'barcode'}
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-1.5 align-text-bottom"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" /></svg>
          Image Scan
        </button>
        <button 
            onClick={() => setActiveInput('voice')} 
            className={`${tabCommonStyle} ${activeInput === 'voice' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeInput === 'voice'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-1.5 align-text-bottom"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 0 0 .75-.75V5.25A.75.75 0 0 0 12 4.5h-.75a.75.75 0 0 0-.75.75v13.5c0 .414.336.75.75.75h.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5M7.5 12a4.5 4.5 0 0 0 4.5 4.5M16.5 12a4.5 4.5 0 0 1-4.5 4.5m0-13.5a4.5 4.5 0 0 1 4.5 4.5" /></svg>
          Voice Command
        </button>
      </div>

      {activeInput === 'text' && (
        <div className="relative"> {/* Container for search input and suggestions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSearchSuggestions(e.target.value.length > 0); }}
              onFocus={() => searchTerm.length > 0 && setShowSearchSuggestions(true)}
              placeholder="e.g., 'sustainable kitchenware'"
              className="flex-grow p-3 border border-slate-400 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition shadow-sm"
              onKeyPress={(e) => e.key === 'Enter' && onSearch(searchTerm)}
              aria-haspopup="listbox" 
              aria-expanded={showSearchSuggestions}
            />
            <button 
              onClick={() => onSearch(searchTerm)} 
              disabled={isLoadingProducts || (!isGeminiAvailable && !searchTerm.trim())}
              className="bg-amber-400 hover:bg-amber-500 text-slate-800 font-semibold py-3 px-5 rounded-md transition duration-150 disabled:opacity-60 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              Search
            </button>
          </div>
          {showSearchSuggestions && searchTerm.length > 0 && (
            <SearchSuggestionsComponent
              suggestions={predefinedSearchSuggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))}
              onSuggestionClick={onSuggestionClick}
            />
          )}
        </div>
      )}

      {activeInput === 'barcode' && <BarcodeScannerMockup onScanResult={handleBarcodeAnalysis} addAlert={addAlert} />}
      {activeInput === 'voice' && <VoiceSearchMockup onVoiceCommand={handleVoiceCommandInterpretation} addAlert={addAlert}/>}
      
    </div>
  );
};

export default MultiModalHub;
