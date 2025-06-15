
import React from 'react';
import { ExternalAnalysisResult } from '../types';

interface SustainabilityAnalysisCardProps {
  result: ExternalAnalysisResult;
}

const SustainabilityAnalysisCard: React.FC<SustainabilityAnalysisCardProps> = ({ result }) => {
  const scorePercentage = result.sustainabilityScore;
  let scoreColor = 'bg-red-500';
  if (scorePercentage > 75) {
    scoreColor = 'bg-green-500';
  } else if (scorePercentage > 40) {
    scoreColor = 'bg-yellow-500';
  }

  const co2VizWidth = Math.min(100, (result.co2FootprintKg / 10) * 100); 
  let co2Color = 'bg-green-500';
   if (result.co2FootprintKg > 5) {
    co2Color = 'bg-red-500';
  } else if (result.co2FootprintKg > 2) {
    co2Color = 'bg-yellow-500';
  }

  const sourceDisplay = result.sourceType === 'url' 
    ? <a href={result.sourceValue} target="_blank" rel="noopener noreferrer" className="text-sky-500 dark:text-sky-400 hover:underline break-all">{result.sourceValue}</a>
    : <span className="text-slate-600 dark:text-slate-300">{result.sourceValue}</span>;

  return (
    <div className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Analysis for: <span className="text-sky-600 dark:text-sky-400">{result.productName}</span></h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Source ({result.sourceType}): {sourceDisplay}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Analyzed on: {new Date(result.analysisDate).toLocaleDateString()}</p>


      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sustainability Score:</span>
            <span className={`text-lg font-bold ${
                result.sustainabilityScore > 75 ? 'text-green-600 dark:text-green-400' :
                result.sustainabilityScore > 40 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
            }`}>
              {result.sustainabilityScore.toFixed(0)}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${scoreColor} transition-all duration-500 ease-out`}
              style={{ width: `${scorePercentage}%` }}
              role="progressbar"
              aria-valuenow={result.sustainabilityScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Sustainability Score"
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Est. CO₂ Footprint:</span>
            <span className={`text-lg font-bold ${
                 result.co2FootprintKg > 5 ? 'text-red-600 dark:text-red-400' :
                 result.co2FootprintKg > 2 ? 'text-yellow-600 dark:text-yellow-400' :
                 'text-green-600 dark:text-green-400'
            }`}>
              {result.co2FootprintKg.toFixed(2)} kg CO₂e
            </span>
          </div>
           <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${co2Color} transition-all duration-500 ease-out`}
              style={{ width: `${co2VizWidth}%` }}
              role="progressbar"
              aria-valuenow={result.co2FootprintKg}
              aria-valuemin={0}
              aria-valuemax={10} 
              aria-label="CO2 Footprint Scale"
            ></div>
          </div>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">Lower CO₂ is better.</p>
        </div>
      </div>
       <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400">
        Note: This analysis is AI-generated and may not reflect the specific item. For illustrative purposes.
      </p>
    </div>
  );
};

export default SustainabilityAnalysisCard;
