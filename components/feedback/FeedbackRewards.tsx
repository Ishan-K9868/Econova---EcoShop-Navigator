import React, { useState, useEffect } from 'react';
import { FeedbackCategoryName, FeedbackSeverity } from '../../types';
import { FEEDBACK_CATEGORIES, COINS_SCREENSHOT_BONUS } from '../../constants';

interface FeedbackRewardsProps {
  selectedCategory: FeedbackCategoryName | '';
  selectedSeverity: FeedbackSeverity;
  includeScreenshot: boolean;
  onExpectedCoinsChange: (coins: number) => void;
}

const FeedbackRewards: React.FC<FeedbackRewardsProps> = ({ 
  selectedCategory, 
  selectedSeverity, 
  includeScreenshot,
  onExpectedCoinsChange
}) => {
  const [expectedCoins, setExpectedCoins] = useState(0);

  useEffect(() => {
    if (!selectedCategory) {
      setExpectedCoins(0);
      onExpectedCoinsChange(0);
      return;
    }

    const categoryDetails = FEEDBACK_CATEGORIES[selectedCategory];
    if (!categoryDetails) {
      setExpectedCoins(0);
      onExpectedCoinsChange(0);
      return;
    }

    let baseCoins = categoryDetails.coins;
    let severityMultiplier = 1.0;
    if (selectedSeverity >= 4) severityMultiplier = 1.5; // Critical/High severity = 1.5x
    else if (selectedSeverity === 3) severityMultiplier = 1.2; // Medium severity = 1.2x
    
    let screenshotBonus = includeScreenshot ? COINS_SCREENSHOT_BONUS : 0;
    
    const calculatedCoins = Math.floor(baseCoins * severityMultiplier + screenshotBonus);
    setExpectedCoins(calculatedCoins);
    onExpectedCoinsChange(calculatedCoins);
  }, [selectedCategory, selectedSeverity, includeScreenshot, onExpectedCoinsChange]);

  return (
    <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/50 rounded-lg border border-sky-200 dark:border-sky-700">
      <div className="flex items-center justify-center text-sm text-sky-700 dark:text-sky-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-yellow-500 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
          <path d="M10 4.5a.5.5 0 00-1 0V5a.5.5 0 001 0V4.5zM7.5 6a.5.5 0 000-1H7a.5.5 0 000 1h.5zM6 7.5a.5.5 0 00-1 0V8a.5.5 0 001 0V7.5zM4.5 10a.5.5 0 000-1H4a.5.5 0 000 1h.5zM6 12.5a.5.5 0 00-1 0V13a.5.5 0 001 0v-.5zM7.5 14a.5.5 0 000-1H7a.5.5 0 000 1h.5zM10 15.5a.5.5 0 00-1 0V16a.5.5 0 001 0v-.5zM12.5 14a.5.5 0 000 1H13a.5.5 0 000-1h-.5zM14 12.5a.5.5 0 001 0V12a.5.5 0 00-1 0v.5zM15.5 10a.5.5 0 000 1H16a.5.5 0 000-1h-.5zM14 7.5a.5.5 0 001 0V7a.5.5 0 00-1 0v.5zM12.5 6a.5.5 0 000 1H13a.5.5 0 000-1h-.5z" />
        </svg>
        <span>Earn an estimated <strong className="font-semibold">{expectedCoins}</strong> EcoCoins for this feedback!</span>
      </div>
    </div>
  );
};

export default FeedbackRewards;
