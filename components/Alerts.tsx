
import React from 'react';
import { AlertMessage, AlertType } from '../types';

interface AlertsProps {
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

const AlertIcon: React.FC<{ type: AlertType }> = ({ type }) => {
  switch (type) {
    case AlertType.SUCCESS:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500 dark:text-green-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case AlertType.ERROR:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 dark:text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      );
    case AlertType.INFO:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      );
    default:
      return null;
  }
};

const Alerts: React.FC<AlertsProps> = ({ alerts, removeAlert }) => {
  if (alerts.length === 0) {
    return null;
  }

  const alertStyles = (type: AlertType) => {
    switch (type) {
      case AlertType.SUCCESS: 
        return "bg-green-100 dark:bg-green-700 border-green-400 dark:border-green-600 text-green-700 dark:text-green-100";
      case AlertType.ERROR: 
        return "bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100";
      case AlertType.INFO: 
        return "bg-blue-100 dark:bg-blue-700 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-100";
      default: 
        return "bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[100] w-full max-w-sm space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 border-l-4 rounded-md shadow-lg flex items-start ${alertStyles(alert.type)} transition-colors duration-300`}
          role="alert"
        >
          <div className="mr-3 pt-0.5">
            <AlertIcon type={alert.type} />
          </div>
          <div className="flex-grow">
            <p className="font-medium">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
            <p className="text-sm">{alert.message}</p>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-opacity-50 inline-flex h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Alerts;