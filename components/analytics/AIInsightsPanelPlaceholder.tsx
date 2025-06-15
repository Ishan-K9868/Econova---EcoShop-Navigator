
import React from 'react';

interface AIInsightsPanelPlaceholderProps {
  // insights: any; // In a real app, this would be structured AI insights
  onGenerateInsights?: () => void; // Optional function to trigger regeneration
}

const AIInsightsPanelPlaceholder: React.FC<AIInsightsPanelPlaceholderProps> = ({ onGenerateInsights }) => {
  const mockInsights = [
    "You're doing great at analyzing apparel! Try exploring sustainable kitchenware next.",
    "Your CO2 savings are 15% above average for users with similar activity. Keep it up!",
    "Consider setting a goal to maintain your analysis streak for another week to earn bonus EcoCoins."
  ];

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">🤖 AI Sustainability Insights (Mocked)</h3>
      <div className="space-y-2">
        {mockInsights.map((insight, index) => (
          <div key={index} className="p-3 bg-sky-50 dark:bg-sky-900/40 rounded-md border border-sky-200 dark:border-sky-700">
            <p className="text-sm text-sky-700 dark:text-sky-300">{insight}</p>
          </div>
        ))}
      </div>
      {onGenerateInsights && (
        <button 
          onClick={onGenerateInsights}
          className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-3 rounded-md transition text-sm"
        >
          Refresh Insights (Simulated)
        </button>
      )}
       <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center">
        These are sample insights. Full AI-powered analysis coming soon!
      </p>
    </div>
  );
};

export default AIInsightsPanelPlaceholder;
