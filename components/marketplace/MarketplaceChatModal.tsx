
import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceListing, MarketplaceChatMessage } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface MarketplaceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing;
  messages: MarketplaceChatMessage[];
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
  isGeminiAvailable: boolean;
}

const MarketplaceChatModal: React.FC<MarketplaceChatModalProps> = ({
  isOpen,
  onClose,
  listing,
  messages,
  onSendMessage,
  isLoading,
  isGeminiAvailable,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate pr-5">
            Chat about: {listing.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-800/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-2.5 rounded-xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white rounded-br-none'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                 <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-100 text-right' : 'text-slate-500 dark:text-slate-400 text-left'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-2.5 rounded-xl shadow-sm bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-none">
                <LoadingSpinner size="sm" text="Seller is typing..." />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
            {!isGeminiAvailable && (
                <p className="text-xs text-center text-orange-500 dark:text-orange-400 mb-1.5">
                    AI Seller simulation is currently unavailable.
                </p>
            )}
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && isGeminiAvailable && handleSend()}
              placeholder={isGeminiAvailable ? "Type your message..." : "Chat unavailable"}
              className="flex-grow p-2.5 border border-slate-300 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-300 transition shadow-sm"
              disabled={isLoading || !isGeminiAvailable}
              aria-label="Chat message input"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim() || !isGeminiAvailable}
              className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium p-2.5 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceChatModal;
