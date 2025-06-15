
import React, { useState } from 'react';
import { Product, SellerProduct, NewProductFormData, AlertType } from '../../types';
import { INITIAL_SELLER_PRODUCTS } from '../../constants';
import AddItemModal from './AddItemModal';
import SellerProductCard from './SellerProductCard';
import LoadingSpinner from '../LoadingSpinner';

interface SellerAdminPageProps {
  isSellerLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  addAlert: (message: string, type: AlertType) => void;
  calculateEcoScore: (productData: Product) => number; // Pass the actual calculator
}

const SellerAdminPage: React.FC<SellerAdminPageProps> = ({ 
    isSellerLoggedIn, 
    onLogin, 
    onLogout, 
    addAlert,
    calculateEcoScore 
}) => {
  const [username, setUsername] = useState('EcoSellerDemo'); // Simulated username
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>(
    INITIAL_SELLER_PRODUCTS.map(p => ({...p, sellerId: 'simulated-seller-1', status: 'active'}))
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate login delay
    setTimeout(() => {
      onLogin();
      setIsLoggingIn(false);
    }, 1000);
  };

  const handleAddProduct = (productData: NewProductFormData) => {
    const newProductBase: Product = {
        id: `seller-prod-${Date.now()}`,
        name: productData.name,
        imageUrl: productData.imageUrl || 'https://picsum.photos/seed/new_item/400/300',
        description: productData.description,
        ecoScore: 0, // Will be calculated
        carbonFootprint: productData.carbonFootprint,
        category: productData.category,
        certifications: [], // Can be added via an edit form later
        price: productData.price,
        materials: productData.materials.split(',').map(m => m.trim()).filter(m => m),
        durabilityScore: productData.durabilityScore,
        packagingScore: productData.packagingScore,
        healthImpactScore: productData.healthImpactScore,
    };
    const ecoScore = calculateEcoScore(newProductBase);
    const newSellerProduct: SellerProduct = {
        ...newProductBase,
        ecoScore: ecoScore,
        sellerId: 'simulated-seller-1', // Simulated
        status: 'pending_review' // Default status for new items
    };

    setSellerProducts(prev => [newSellerProduct, ...prev]);
    addAlert(`Product "${newSellerProduct.name}" added for review!`, AlertType.SUCCESS);
  };

  const handleRemoveProduct = (productId: string) => {
    setSellerProducts(prev => prev.filter(p => p.id !== productId));
    addAlert('Product removed from your listings (simulated).', AlertType.INFO);
  };

  if (!isSellerLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Seller Admin Login</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="sellerUsername" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username (Simulated)
              </label>
              <input
                type="text"
                id="sellerUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:text-slate-100"
                placeholder="Enter your seller username"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70"
            >
              {isLoggingIn ? <LoadingSpinner size="sm" /> : 'Login as Seller (Simulated)'}
            </button>
             <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                This is a simulated login. Any username will work. Ensure you've completed "Become a Seller" first if this is your first time.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-0">
          Welcome, {username}! (Seller Dashboard)
        </h2>
        <div className="flex items-center space-x-3">
            <button
                onClick={() => setShowAddItemModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md flex items-center"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add New Product
            </button>
            <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md"
            >
                Logout
            </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6">Your Listed Products (Simulated)</h3>
      {sellerProducts.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-400 text-lg">You haven't listed any products yet. Click "Add New Product" to start!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellerProducts.map((product) => (
            <SellerProductCard
              key={product.id}
              product={product}
              onRemove={handleRemoveProduct}
              // onEdit={(p) => alert(`Editing ${p.name} - coming soon!`)}
            />
          ))}
        </div>
      )}

      {showAddItemModal && (
        <AddItemModal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}
       <p className="mt-10 text-xs text-center text-slate-500 dark:text-slate-400">
        This Seller Admin Page is for demonstration purposes. Product listings and management are simulated locally.
      </p>
    </div>
  );
};

export default SellerAdminPage;
