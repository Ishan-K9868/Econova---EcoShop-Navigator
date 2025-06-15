
import React from 'react';
import { ComparativeStats } from '../../types';

interface ComparativeStatsDisplayProps {
  stats: ComparativeStats;
}

const ComparativeStatItem: React.FC<{ label: string; value: string | number; icon: React.ReactNode; positiveIsGood?: boolean; unit?: string }> = ({ label, value, icon, positiveIsGood = true, unit ='' }) => {
    const valueNum = typeof value === 'number' ? value : parseFloat(value.toString());
    let valueColor = "text-slate-700 dark:text-slate-200";
    if(typeof value === 'number' && unit === '%') {
        if (positiveIsGood) {
            valueColor = valueNum > 0 ? "text-green-600 dark:text-green-400" : valueNum < 0 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200";
        } else {
            valueColor = valueNum < 0 ? "text-green-600 dark:text-green-400" : valueNum > 0 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200";
        }
    }


  return (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex items-center space-x-2">
      <span className="text-sky-500 dark:text-sky-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-md font-semibold ${valueColor}`}>
            {typeof value === 'number' && value > 0 && unit === '%' && positiveIsGood ? '+' : ''}
            {value}
            {unit}
        </p>
      </div>
    </div>
  );
}

const ComparativeStatsDisplay: React.FC<ComparativeStatsDisplayProps> = ({ stats }) => {
  return (
    <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">How You Compare (Mock Data)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ComparativeStatItem 
          label="CO₂ Saved vs. Avg User" 
          value={stats.vs_avg_user_co2_saved_percent} 
          unit="%"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>}
        />
        {stats.community_ranking && (
          <ComparativeStatItem 
            label="Community Ranking" 
            value={`#${stats.community_ranking}`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 12.75 9H11.25A3.375 3.375 0 0 0 7.5 12.375v4.5m0 0h9" /></svg>}
          />
        )}
        {stats.global_percentile && (
          <ComparativeStatItem 
            label="Global Percentile" 
            value={`Top ${100 - stats.global_percentile}%`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" /></svg>}
          />
        )}
      </div>
    </div>
  );
};

export default ComparativeStatsDisplay;
