
import React from 'react';
import { PersonalStats } from '../../types';

interface ImpactHeroStatsProps {
  stats: PersonalStats;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ label, value, icon, colorClass }) => (
  <div className={`p-4 rounded-lg shadow-md flex items-center space-x-3 ${colorClass}`}>
    <div className="flex-shrink-0 text-white p-2 rounded-full bg-black/20">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-white/90">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);


const ImpactHeroStats: React.FC<ImpactHeroStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <StatCard 
        label="Total CO₂ Saved" 
        value={`${stats.total_co2_saved.toFixed(1)} kg`}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l-.995-1.493a1.5 1.5 0 010-1.506l.995-1.493L4.01 6.75l2.225-.016a1.867 1.867 0 011.765 1.076l.22 .439a.868.868 0 001.54 0l.22-.44a1.867 1.867 0 011.766-1.076l2.224.016L19.99 9.25l.995 1.493a1.5 1.5 0 010 1.506l-.995 1.493-1.755 2.984-2.225.016a1.867 1.867 0 01-1.765-1.076l-.22-.439a.868.868 0 00-1.54 0l-.22.44a1.867 1.867 0 01-1.766-1.076l-2.224-.016L2.25 12.75Z" /></svg>}
        colorClass="bg-green-500 dark:bg-green-600"
      />
      <StatCard 
        label="Products Analyzed" 
        value={stats.total_products_analyzed}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m4.004-1.252a11.93 11.93 0 0 0-8.008 0M12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /></svg>}
        colorClass="bg-sky-500 dark:bg-sky-600"
      />
      <StatCard 
        label="EcoCoins Earned" 
        value={stats.coins_earned}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6.248a2.251 2.251 0 0 1-2.062 2.248H5.062A2.251 2.251 0 0 1 3 18.248V12m18 0V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v5.25m0 0H21M12 15V9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75Zm3.75-1.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
        colorClass="bg-yellow-500 dark:bg-yellow-600"
      />
      <StatCard 
        label="Sustainability Streak" 
        value={`${stats.sustainability_streak} days`}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008Zm2.25-4.5h.008v.008H14.25v-.008Zm0 2.25h.008v.008H14.25v-.008Z" /></svg>}
        colorClass="bg-indigo-500 dark:bg-indigo-600"
      />
       <StatCard 
        label="Eco Score Improvement" 
        value={`${stats.eco_score_improvement > 0 ? '+' : ''}${stats.eco_score_improvement}%`}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
        colorClass="bg-pink-500 dark:bg-pink-600"
      />
    </div>
  );
};

export default ImpactHeroStats;
