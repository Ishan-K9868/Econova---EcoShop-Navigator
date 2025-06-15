import React, { useEffect, useRef } from 'react';
import { CoinTransaction, CoinReward, AlertType, UserMilestones, Quiz } from '../types';
import { 
    ACHIEVEMENT_FIRST_ANALYSIS, ACHIEVEMENT_NOVICE_ANALYZER, ACHIEVEMENT_ECO_EXPLORER,
    ACHIEVEMENT_CARBON_CRUSHER, ACHIEVEMENT_PROFILE_COMPLETION,
    ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS, ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS,
    ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE, ACHIEVEMENT_FIRST_QUIZ_COMPLETED,
    AVAILABLE_QUIZZES // Import available quizzes
    // ACHIEVEMENT_SUSTAINABLE_PURCHASE_PREFIX 
} from '../constants';


interface WalletPageProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
  transactions: CoinTransaction[];
  rewards: CoinReward[];
  onRedeemReward: (reward: CoinReward) => boolean; 
  addAlert: (message: string, type: AlertType) => void;
  userMilestones: UserMilestones;
  onTakeQuiz: (quiz: Quiz) => void; // New prop to handle taking a quiz
}

const WalletPage: React.FC<WalletPageProps> = ({
  isOpen,
  onClose,
  userCoins,
  transactions,
  rewards,
  onRedeemReward,
  addAlert,
  userMilestones,
  onTakeQuiz, 
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRedeem = (reward: CoinReward) => {
    if (userCoins < reward.cost) {
      addAlert(`You don't have enough EcoCoins to redeem "${reward.name}".`, AlertType.ERROR);
      return;
    }
    onRedeemReward(reward);
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const getAchievementDisplayName = (achievementKey: string): string => {
    switch (achievementKey) {
        case ACHIEVEMENT_FIRST_ANALYSIS: return "First Analysis Bonus";
        case ACHIEVEMENT_NOVICE_ANALYZER: return "Novice Analyzer";
        case ACHIEVEMENT_ECO_EXPLORER: return "Eco Explorer";
        case ACHIEVEMENT_CARBON_CRUSHER: return "Carbon Crusher";
        case ACHIEVEMENT_PROFILE_COMPLETION: return "Profile Complete";
        case ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS: return "3-Day Analysis Streak";
        case ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS: return "7-Day Analysis Streak";
        case ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE: return "First Eco Purchase";
        case ACHIEVEMENT_FIRST_QUIZ_COMPLETED: return "First Quiz Pro";
        default:
            // if (achievementKey.startsWith(ACHIEVEMENT_SUSTAINABLE_PURCHASE_PREFIX)) {
            //     return "Sustainable Purchase"; 
            // }
            return achievementKey.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[70] p-4 transition-opacity duration-300">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2 text-yellow-500 dark:text-yellow-400">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6.248a2.251 2.251 0 0 1-2.062 2.248H5.062A2.251 2.251 0 0 1 3 18.248V12m18 0V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v5.25m0 0H21M12 15V9" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75Zm3.75-1.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                My EcoCoins Wallet
            </h2>
            <button
                onClick={onClose}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
                aria-label="Close wallet"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-grow">
            {/* Balance */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-700 text-center">
                <h3 className="text-md font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Your EcoCoin Balance</h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{userCoins} Coins</p>
            </div>

            {/* Achievements Section */}
            {userMilestones.achievementsUnlocked.length > 0 && (
              <div className="p-4 bg-sky-50 dark:bg-sky-900/30 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700">
                <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mb-3">Achievements Unlocked!</h3>
                <div className="flex flex-wrap gap-2">
                  {userMilestones.achievementsUnlocked.map(achId => (
                    <span key={achId} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-700 dark:text-sky-100 border border-sky-300 dark:border-sky-600" title={getAchievementDisplayName(achId)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.722c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {getAchievementDisplayName(achId)}
                    </span>
                  ))}
                </div>
              </div>
            )}


            {/* Transactions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Transaction History</h3>
                {transactions.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No transactions yet. Start earning EcoCoins!</p>
                ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {transactions.map(tx => (
                    <li key={tx.id} className="flex justify-between items-center p-2 bg-white dark:bg-slate-700 rounded-md shadow-xs border border-slate-100 dark:border-slate-600">
                        <div>
                        <p className={`font-medium text-sm ${tx.type === 'earned' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} Coins
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400" title={tx.context ? `Context: ${JSON.stringify(tx.context)}` : ''}>{tx.reason}</p>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatTimestamp(tx.date)}</p>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            
            {/* Quiz Earning Section */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">Sustainability Quizzes</h3>
                {AVAILABLE_QUIZZES.length > 0 ? (
                    <>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                            Test your eco-knowledge and earn coins!
                        </p>
                        <button
                            onClick={() => onTakeQuiz(AVAILABLE_QUIZZES[0])} // Example: always take the first quiz
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-md transition duration-150 shadow-sm flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            Take {AVAILABLE_QUIZZES[0].title}
                        </button>
                    </>
                ) : (
                    <p className="text-sm text-purple-600 dark:text-purple-400">Quizzes are coming soon!</p>
                )}
            </div>


            {/* Rewards Store */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Rewards Store</h3>
                {rewards.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No rewards available at the moment. Check back soon!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                        {rewards.map(reward => (
                        <div key={reward.id} className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 flex flex-col justify-between">
                            <div>
                                <h4 className="font-semibold text-md text-sky-700 dark:text-sky-400">{reward.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{reward.category}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{reward.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{reward.cost} <span className="text-xs">Coins</span></p>
                                <button
                                    onClick={() => handleRedeem(reward)}
                                    disabled={userCoins < reward.cost}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md text-xs transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    Redeem
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">
            <button
                onClick={onClose}
                className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-md transition duration-150 text-sm shadow-sm"
            >
                Close Wallet
            </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
