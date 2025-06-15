
import React from 'react';
import { Product, CartType } from '../types';
import ProductCard from './ProductCard'; // Ensured relative path
import LoadingSpinner from './LoadingSpinner';

interface ProductListProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, cartType: CartType) => void; 
  isLoading: boolean;
  title?: string;
  triggerPurchaseAnimation: (productId: string) => void; 
}

const ProductList: React.FC<ProductListProps> = ({ products, onViewDetails, onAddToCart, isLoading, title = "Discover Eco-Friendly Products", triggerPurchaseAnimation }) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">{title}</h2>
      {products.length === 0 && !isLoading ? (
         <p className="text-center text-slate-600 dark:text-slate-400 text-lg">No products found. Try broadening your search or check back later!</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart} 
              triggerPurchaseAnimation={triggerPurchaseAnimation} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
