
// This component's UI is largely superseded by CartModal.tsx.
// Its logic for calculation might be reused or adapted within CartModal or App.tsx.
// For now, it's not rendered directly in App.tsx anymore.

import React from 'react';
import { GroupBuyItem } from '../types'; // Note: This might need to be CartItem if types are unified
import { DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE } from '../constants';

interface GroupBuySimulatorProps {
  items: GroupBuyItem[]; // Or CartItem[]
  onRemoveItem: (productId: string) => void; // May need cartType if items can be from different carts
  onUpdateQuantity: (productId: string, quantity: number) => void; // May need cartType
}

const GroupBuySimulator: React.FC<GroupBuySimulatorProps> = ({ items, onRemoveItem, onUpdateQuantity }) => {
  const totalOriginalCarbon = items.reduce((sum, item) => sum + item.carbonFootprint * item.quantity, 0);
  const co2Saved = (totalOriginalCarbon * DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE) / 100;
  const totalGroupBuyCarbon = totalOriginalCarbon - co2Saved;
  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // The UI previously here is now mostly in CartModal.tsx
  // This file can be deleted or kept for logic reference.
  // If kept, it shouldn't be rendered directly.

  return (
    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg shadow-md sticky top-24 border border-dashed border-gray-400 dark:border-slate-600">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-2">Group Buy Simulator (Legacy)</h3>
      <p className="text-xs text-gray-500 dark:text-slate-400">This component's UI has been moved to the main Cart Modal accessible from the header.</p>
      {items.length > 0 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-slate-300">
          <p>Items: {items.reduce((acc, item) => acc + item.quantity, 0)}</p>
          <p>Est. CO2 Saved: {co2Saved.toFixed(2)} kg</p>
          <p>Total Cost: ${totalCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default GroupBuySimulator;