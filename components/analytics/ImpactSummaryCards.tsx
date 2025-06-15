
import React from 'react';
import { EnvironmentalImpactNumbers } from '../../types';
import { CO2_PER_TREE_EQUIVALENT_KG, USD_PER_KG_CO2_OFFSET } from '../../constants';

interface ImpactSummaryCardsProps {
  metrics: EnvironmentalImpactNumbers;
  totalCo2SavedGlobal: number; // Pass the global CO2 saved from personal_stats
}

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; unit?: string; note?: string }> = ({ title, value, icon, unit, note }) => (
  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-center">
    <div className="text-3xl mb-2 text-sky-500 dark:text-sky-400 mx-auto w-fit">{icon}</div>
    <h4 className="text-md font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
      {value} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{unit}</span>
    </p>
    {note && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{note}</p>}
  </div>
);

const ImpactSummaryCards: React.FC<ImpactSummaryCardsProps> = ({ metrics, totalCo2SavedGlobal }) => {
  // Calculate derived metrics
  const treesEquivalent = (totalCo2SavedGlobal / CO2_PER_TREE_EQUIVALENT_KG).toFixed(1);
  const carbonOffsetValue = (totalCo2SavedGlobal * USD_PER_KG_CO2_OFFSET).toFixed(2);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <SummaryCard 
        title="Trees Equivalent" 
        value={treesEquivalent} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0 .002 18m-.002-9h11.994M3.002 9h3.994m0 0h.004v.004h-.004v-.004ZM7.002 9h3.994M3.002 15h3.994m0 0h.004v.004h-.004v-.004ZM7.002 15h3.994" /></svg>} 
        unit="trees"
        note={`Based on ${CO2_PER_TREE_EQUIVALENT_KG}kg CO₂/tree/year`}
      />
      <SummaryCard 
        title="Water Saved (Est.)" 
        value={metrics.water_saved_liters.toLocaleString()} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 19.5 4.906-4.906a2.25 2.25 0 0 1 3.182 0l4.906 4.906M8.25 19.5V5.625a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v13.875m0 0V5.625a2.25 2.25 0 0 0-2.25-2.25h-3a2.25 2.25 0 0 0-2.25 2.25v13.875" /></svg>} 
        unit="liters"
        note="Simulated, varies by product type"
      />
      <SummaryCard 
        title="Waste Reduced (Est.)" 
        value={metrics.waste_reduced_kg.toFixed(1)} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>} 
        unit="kg"
        note="From choosing durable/recycled items"
      />
      <SummaryCard 
        title="Carbon Offset Value" 
        value={`$${carbonOffsetValue}`} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} 
        unit="USD"
        note={`Based on $${USD_PER_KG_CO2_OFFSET}/kg CO₂ market value`}
      />
    </div>
  );
};

export default ImpactSummaryCards;
