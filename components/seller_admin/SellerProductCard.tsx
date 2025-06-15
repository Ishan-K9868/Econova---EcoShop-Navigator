
import React from 'react';
import { SellerProduct } from '../../types'; // Assuming SellerProduct extends Product or is similar

interface SellerProductCardProps {
  product: SellerProduct;
  onRemove: (productId: string) => void;
  // onEdit: (product: SellerProduct) => void; // For future implementation
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({ product, onRemove }) => {
  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-slate-200 dark:border-slate-600">
      <img className="w-full h-40 object-cover" src={product.imageUrl || 'https://picsum.photos/seed/default_product/400/300'} alt={product.name} />
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{product.category}</p>
        
        <div className="mb-2">
          <span className="text-xs text-slate-600 dark:text-slate-300">EcoScore: </span>
          <span className={`font-bold text-xs ${product.ecoScore >= 4 ? 'text-green-600 dark:text-green-400' : product.ecoScore >=2.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
            {product.ecoScore.toFixed(1)}/5
          </span>
        </div>
        
        <p className="text-lg font-bold text-slate-800 dark:text-slate-50 mb-2">${product.price.toFixed(2)}</p>
        
        {product.status && (
            <p className={`text-xs font-medium mb-2 ${
                product.status === 'active' ? 'text-green-600 dark:text-green-400' :
                product.status === 'pending_review' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-slate-500 dark:text-slate-400'
            }`}>
                Status: {product.status.replace('_', ' ')}
            </p>
        )}

        <div className="mt-auto flex space-x-2">
          <button
            // onClick={() => onEdit(product)} // Placeholder for future edit functionality
            onClick={() => alert(`Edit feature for "${product.name}" coming soon!`)}
            className="flex-1 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-medium py-1.5 px-2 rounded-md transition duration-150 text-xs shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium py-1.5 px-2 rounded-md transition duration-150 text-xs shadow-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
