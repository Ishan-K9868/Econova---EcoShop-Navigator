
import React, { useState, useEffect } from 'react';
import { UserImpactMetrics, AlertType, UserGoal, AISuggestedGoal } from '../../types';
import { MOCK_UserGoal, MOCK_AISuggestedGoal } from '../../constants'; // Assuming you have mock goals defined

import ImpactHeroStats from './ImpactHeroStats';
import ImpactSummaryCards from './ImpactSummaryCards';
import ComparativeStatsDisplay from './ComparativeStatsDisplay';
import TimeSeriesChartPlaceholder from './TimeSeriesChartPlaceholder';
import SustainabilityGoalSetterUI from './SustainabilityGoalSetterUI';
import AIInsightsPanelPlaceholder from './AIInsightsPanelPlaceholder';
// Placeholder for future Social Impact and Rewards components
// import SocialImpactView from './SocialImpactView'; 
// import RewardsAndAchievements from './RewardsAndAchievements';

interface PersonalImpactDashboardProps {
  userImpactData: UserImpactMetrics;
  addAlert: (message: string, type: AlertType) => void;
}

const PersonalImpactDashboard: React.FC<PersonalImpactDashboardProps> = ({ userImpactData, addAlert }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'goals' | 'insights' | 'social' | 'rewards'>('trends');
  
  // Mocked state for goals - in a real app, this would come from props or a context/store
  const [currentGoals, setCurrentGoals] = useState<UserGoal[]>(MOCK_UserGoal);
  const [suggestedGoals, setSuggestedGoals] = useState<AISuggestedGoal[]>(MOCK_AISuggestedGoal);

  const handleAcceptSuggestedGoal = (goalToAccept: AISuggestedGoal) => {
    // Simulate adding to current goals and removing from suggestions
    const newCurrentGoal: UserGoal = {
      ...goalToAccept,
      currentValue: 0, // Start progress at 0
      isAchieved: false,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Example: 30 days from now
    };
    setCurrentGoals(prev => [...prev, newCurrentGoal]);
    setSuggestedGoals(prev => prev.filter(g => g.id !== goalToAccept.id));
    addAlert(`Goal "${goalToAccept.title}" accepted!`, AlertType.SUCCESS);
    if (goalToAccept.potentialCoinReward) {
        // addCoins(goalToAccept.potentialCoinReward, `Accepted AI Goal: ${goalToAccept.title.substring(0,15)}...`);
        // Coins usually awarded on completion, but can add a small bonus for accepting
    }
  };

  const handleUpdateCurrentGoalProgress = (goalId: string, progress: number) => {
    setCurrentGoals(prev => prev.map(g => g.id === goalId ? {...g, currentValue: Math.min(g.targetValue, progress) } : g));
    // Check if goal is achieved
  };

  const tabCommonStyle = "py-2 px-4 text-sm font-medium rounded-t-lg cursor-pointer transition-colors duration-150 focus:outline-none";
  const activeTabStyle = "bg-sky-500 text-white dark:bg-sky-600";
  const inactiveTabStyle = "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200";
  
  return (
    <div className="py-6 px-2 sm:px-4">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">My Sustainability Impact</h2>
      
      <ImpactHeroStats stats={userImpactData.personal_stats} />
      <ImpactSummaryCards metrics={userImpactData.environmental_impact} totalCo2SavedGlobal={userImpactData.personal_stats.total_co2_saved} />
      <ComparativeStatsDisplay stats={userImpactData.comparative_stats} />

      <div className="mt-8 bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-lg shadow-md">
        <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
          <nav className="flex flex-wrap -mb-px space-x-1 sm:space-x-2" aria-label="Tabs">
            <button onClick={() => setActiveTab('trends')} className={`${tabCommonStyle} ${activeTab === 'trends' ? activeTabStyle : inactiveTabStyle}`}>Trends</button>
            <button onClick={() => setActiveTab('goals')} className={`${tabCommonStyle} ${activeTab === 'goals' ? activeTabStyle : inactiveTabStyle}`}>Goals</button>
            <button onClick={() => setActiveTab('insights')} className={`${tabCommonStyle} ${activeTab === 'insights' ? activeTabStyle : inactiveTabStyle}`}>AI Insights</button>
            <button onClick={() => setActiveTab('social')} className={`${tabCommonStyle} ${activeTab === 'social' ? activeTabStyle : inactiveTabStyle} opacity-50 cursor-not-allowed`} title="Social Impact (Coming Soon)">Social</button>
            <button onClick={() => setActiveTab('rewards')} className={`${tabCommonStyle} ${activeTab === 'rewards' ? activeTabStyle : inactiveTabStyle} opacity-50 cursor-not-allowed`} title="Rewards (Coming Soon)">Rewards</button>
          </nav>
        </div>

        <div className="py-4">
          {activeTab === 'trends' && (
            <TimeSeriesChartPlaceholder data={userImpactData.time_series_data.daily_co2_savings} title="Daily CO₂ Savings Trend" />
          )}
          {activeTab === 'goals' && (
            <SustainabilityGoalSetterUI 
                currentGoals={currentGoals}
                suggestedGoals={suggestedGoals}
                onAcceptSuggestedGoal={handleAcceptSuggestedGoal}
                onUpdateCurrentGoalProgress={handleUpdateCurrentGoalProgress}
            />
          )}
          {activeTab === 'insights' && (
            <AIInsightsPanelPlaceholder />
          )}
          {activeTab === 'social' && (
            <div className="text-center p-5 text-slate-500 dark:text-slate-400">Social Impact features are coming soon!</div>
          )}
           {activeTab === 'rewards' && (
            <div className="text-center p-5 text-slate-500 dark:text-slate-400">Rewards and Achievements details will be shown here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalImpactDashboard;
