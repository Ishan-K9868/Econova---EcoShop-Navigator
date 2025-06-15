
import React from 'react';
import { UserGoal, AISuggestedGoal } from '../../types';

interface SustainabilityGoalSetterUIProps {
  currentGoals: UserGoal[];
  suggestedGoals: AISuggestedGoal[];
  onAcceptSuggestedGoal: (goal: AISuggestedGoal) => void; // Simulated
  onUpdateCurrentGoalProgress: (goalId: string, progress: number) => void; // Simulated
}

const GoalCard: React.FC<{ goal: UserGoal, onUpdateProgress: (progress: number) => void }> = ({ goal, onUpdateProgress }) => {
  const progressPercent = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
  return (
    <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow border border-slate-200 dark:border-slate-600 mb-2">
      <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200">{goal.title}</h5>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{goal.description}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 my-1">
        <div 
          className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        ></div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {goal.currentValue.toFixed(1)} / {goal.targetValue.toFixed(1)} {goal.unit}
      </p>
      {/* Simulated update button */}
      {/* <button onClick={() => onUpdateProgress(goal.currentValue + (goal.targetValue * 0.1))} className="text-xs text-sky-500 mt-1">Simulate Progress</button> */}
    </div>
  );
};

const SuggestedGoalCard: React.FC<{ goal: AISuggestedGoal, onAccept: () => void }> = ({ goal, onAccept }) => (
  <div className="p-3 bg-sky-50 dark:bg-sky-900/40 rounded-lg shadow border border-sky-200 dark:border-sky-700 mb-2">
    <h5 className="font-semibold text-sm text-sky-700 dark:text-sky-300">{goal.title}</h5>
    <p className="text-xs text-sky-600 dark:text-sky-400 mb-1">{goal.description}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1"><em>AI Reasoning: {goal.reasoning}</em></p>
    {goal.potentialCoinReward && <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Reward: +{goal.potentialCoinReward} Coins</p>}
    <button onClick={onAccept} className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded mt-1">Accept Goal (Simulated)</button>
  </div>
);

const SustainabilityGoalSetterUI: React.FC<SustainabilityGoalSetterUIProps> = ({ 
  currentGoals, 
  suggestedGoals, 
  onAcceptSuggestedGoal,
  onUpdateCurrentGoalProgress
}) => {
  // In a real app, these functions would call backend or update state in App.tsx
  const handleAccept = (goal: AISuggestedGoal) => {
    console.log("Accepted suggested goal (simulated):", goal.title);
    onAcceptSuggestedGoal(goal); 
  };
  const handleUpdate = (goalId: string, progress: number) => {
    console.log(`Updating progress for goal ${goalId} to ${progress} (simulated)`);
    onUpdateCurrentGoalProgress(goalId, progress);
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">🎯 Your Sustainability Goals</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium text-slate-600 dark:text-slate-300 mb-2">Current Goals:</h4>
        {currentGoals.length > 0 ? (
          currentGoals.map(goal => <GoalCard key={goal.id} goal={goal} onUpdateProgress={(progress) => handleUpdate(goal.id, progress)} />)
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No active goals set. Check AI suggestions below!</p>
        )}
      </div>

      <div>
        <h4 className="text-md font-medium text-slate-600 dark:text-slate-300 mb-2">💡 AI-Suggested Goals (Mocked):</h4>
        {suggestedGoals.length > 0 ? (
          suggestedGoals.map((goal) => <SuggestedGoalCard key={goal.id} goal={goal} onAccept={() => handleAccept(goal)} />)
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">AI goal suggestions will appear here soon.</p>
        )}
      </div>
    </div>
  );
};

export default SustainabilityGoalSetterUI;
