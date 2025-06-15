
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ExternalAnalysisResult, AlertType } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface SustainabilityChatbotProps {
  analysisHistory: ExternalAnalysisResult[];
  isGeminiAvailable: boolean;
  addAlert: (message: string, type: AlertType) => void;
}

const SustainabilityChatbot: React.FC<SustainabilityChatbotProps> = ({ analysisHistory, isGeminiAvailable, addAlert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && isGeminiAvailable) {
      // Initial greeting message from bot
      setMessages([
        {
          id: `bot-greeting-${Date.now()}`,
          text: "Hello! I'm your Eco Assistant. How can I help you with sustainable shopping today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } else if (isOpen && !isGeminiAvailable && messages.length === 0) {
       setMessages([
        {
          id: `bot-unavailable-${Date.now()}`,
          text: "Hello! My AI features are currently limited. I can still answer basic questions if possible.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, isGeminiAvailable, messages.length]);


  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0); // Focus input when opening
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (!isGeminiAvailable) {
        setTimeout(() => {
            const botResponse: ChatMessage = {
                id: `bot-fallback-${Date.now()}`,
                text: "I'm sorry, my AI capabilities are limited right now. Please try again later for full assistance.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
            setIsLoading(false);
        }, 1000);
        return;
    }

    try {
      const botText = await getChatbotResponse(trimmedInput, analysisHistory);
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Chatbot error:", error);
      addAlert("Error communicating with the chatbot. Please try again.", AlertType.ERROR);
      const errorResponse: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        text: "Sorry, I had trouble processing that. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* FAB to toggle chat */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white p-4 rounded-full shadow-lg z-[80] transition-transform duration-300 ease-in-out ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open Eco Assistant Chat"
        title="Open Eco Assistant Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.312 3.75 12.375 3.75S21 7.444 21 12Z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-full sm:h-[600px] bg-white dark:bg-slate-800 shadow-xl rounded-none sm:rounded-lg flex flex-col z-[90] border border-slate-300 dark:border-slate-700 transition-all duration-300 ease-in-out transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 rounded-t-none sm:rounded-t-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.283 1.682.43 2.555.43Z" />
              </svg>
              Eco Assistant
            </h3>
            <button onClick={toggleChat} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-2.5 rounded-xl shadow ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-500 dark:text-slate-400 text-left'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="max-w-[80%] p-2.5 rounded-xl shadow bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-none">
                    <LoadingSpinner size="sm" text="Eco Assistant is typing..." />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 rounded-b-none sm:rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask about sustainability..."
                className="flex-grow p-2.5 border border-slate-300 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-300 transition shadow-sm"
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium p-2.5 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
             {!isGeminiAvailable && <p className="text-xs text-orange-500 dark:text-orange-400 mt-1.5 px-1">AI Chatbot features are limited. Full assistance unavailable.</p>}
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8; /* slate-400 */
          border-radius: 3px;
        }
        html.dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
        html.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155; /* slate-700 */
        }
      `}</style>
    </>
  );
};

export default SustainabilityChatbot;
