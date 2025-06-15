
import React from 'react';
import { TimeSeriesDataPoint } from '../../types';

interface TimeSeriesChartPlaceholderProps {
  data: TimeSeriesDataPoint[]; // Data is passed but not used by placeholder
  title: string;
}

const TimeSeriesChartPlaceholder: React.FC<TimeSeriesChartPlaceholderProps> = ({ data, title }) => {
  // For demonstration, we can show a very basic representation or just a message
  const mockValues = data.slice(0, 7).map(d => d.value); // Use a few values for basic viz
  const maxMockValue = Math.max(...mockValues, 1); // Avoid division by zero

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 min-h-[200px] flex flex-col justify-center items-center">
      <h4 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
        (Interactive chart coming soon!)
      </p>
      {/* Basic visual representation */}
      {mockValues.length > 0 && (
        <div className="flex items-end space-x-2 h-24 w-full max-w-xs bg-slate-100 dark:bg-slate-600 p-2 rounded">
          {mockValues.map((value, index) => (
            <div
              key={index}
              className="bg-sky-500 dark:bg-sky-400 rounded-t-sm flex-grow"
              style={{ height: `${(value / maxMockValue) * 100}%` }}
              title={`Date: ${data[index]?.date}, Value: ${value}`}
            ></div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        This is a placeholder for your {title.toLowerCase()} trend data.
      </p>
    </div>
  );
};

export default TimeSeriesChartPlaceholder;
