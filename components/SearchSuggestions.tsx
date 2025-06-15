
import React from 'react';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto transition-colors duration-300">
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-600 hover:text-green-700 dark:hover:text-white cursor-pointer transition-colors"
            role="option"
            aria-selected="false"
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;