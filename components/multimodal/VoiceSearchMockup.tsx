
import React, { useState } from 'react';
import { VoiceCommandInterpretation, AlertType } from '../../types';
import { interpretVoiceCommand, isGeminiAvailable as checkGeminiAvailable } from '../../services/geminiService';
import LoadingSpinner from '../LoadingSpinner';

interface VoiceSearchMockupProps {
  onVoiceCommand: (result: VoiceCommandInterpretation) => void;
  addAlert: (message: string, type: AlertType) => void;
}

const VoiceSearchMockup: React.FC<VoiceSearchMockupProps> = ({ onVoiceCommand, addAlert }) => {
  const [isListening, setIsListening] = useState(false); // Visual for mic button
  const [transcriptInput, setTranscriptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleListeningState = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTranscriptInput(''); 
      // addAlert("Voice input activated (simulated). Type your command below.", AlertType.INFO); // Popup removed
    } else {
      // addAlert("Voice input deactivated (simulated).", AlertType.INFO); // Popup removed
    }
  };

  const handleProcessCommand = async () => {
    if (!transcriptInput.trim()) {
      addAlert("Please type a command to simulate voice input.", AlertType.ERROR);
      return;
    }
    if (!checkGeminiAvailable()) {
        // addAlert("AI service is unavailable. Cannot interpret command.", AlertType.ERROR); // Popup removed
        return;
    }

    setIsProcessing(true);
    setIsListening(false); // Stop "listening" visual
    // addAlert(`Interpreting command with AI: "${transcriptInput}"`, AlertType.INFO); // Popup removed
    
    try {
        const interpretationResult = await interpretVoiceCommand(transcriptInput);
        if (interpretationResult) {
            onVoiceCommand(interpretationResult);
            // addAlert(`AI interpreted command: ${interpretationResult.action} - ${interpretationResult.message || ''}`, AlertType.SUCCESS); // Popup removed
        } else {
            addAlert("AI could not interpret the command or the response was invalid.", AlertType.ERROR);
            // Fallback for UI consistency if needed
            onVoiceCommand({
                originalTranscript: transcriptInput,
                action: 'unknown_intent',
                parameters: {},
                message: "AI interpretation failed."
            });
        }
    } catch (error) {
        console.error("Error interpreting voice command with AI:", error);
        addAlert("An error occurred while interpreting the command with AI.", AlertType.ERROR);
        onVoiceCommand({
            originalTranscript: transcriptInput,
            action: 'unknown_intent',
            parameters: {},
            message: "Error during AI interpretation."
        });
    } finally {
        setIsProcessing(false);
        setTranscriptInput(''); 
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Voice Command</h3>
      
      <button 
        onClick={toggleListeningState}
        disabled={isProcessing}
        className={`p-4 rounded-full transition-colors duration-200 mb-4 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-sky-500 hover:bg-sky-600 text-white'
        }`}
        aria-label={isListening ? "Stop voice input simulation" : "Start voice input simulation"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          {isListening || isProcessing ? ( 
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /> // Stop Icon
          ) : (
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 0 0 .75-.75V5.25A.75.75 0 0 0 12 4.5h-.75a.75.75 0 0 0-.75.75v13.5c0 .414.336.75.75.75h.75Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5M7.5 12a4.5 4.5 0 0 0 4.5 4.5M16.5 12a4.5 4.5 0 0 1-4.5 4.5m0-13.5a4.5 4.5 0 0 1 4.5 4.5" />
            </>
          )}
        </svg>
      </button>

      {isListening && !isProcessing && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Listening (simulated)... Type your command below.
        </p>
      )}
       {isProcessing && (
        <div className="my-2">
          <LoadingSpinner size="sm" text="AI is interpreting..." />
        </div>
      )}


      <textarea
        value={transcriptInput}
        onChange={(e) => setTranscriptInput(e.target.value)}
        placeholder={isListening ? "Type what you would say..." : "Click mic to start typing command"}
        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mb-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-sky-500 dark:focus:ring-sky-400"
        rows={2}
        aria-label="Simulated voice transcript input"
        disabled={isProcessing}
      />

      <button 
        onClick={handleProcessCommand} 
        disabled={isProcessing || !transcriptInput.trim() || !checkGeminiAvailable()}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150 disabled:opacity-60"
      >
        Interpret Command with AI
      </button>
      {!checkGeminiAvailable() && <p className="text-xs text-orange-500 dark:text-orange-400 mt-2">AI Service is unavailable. Voice interpretation disabled.</p>}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Type your command, then AI will interpret its meaning.</p>
    </div>
  );
};

export default VoiceSearchMockup;
