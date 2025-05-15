import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  
  const isInCart = items.some(item => item.product.id === product.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) {
      addToCart(product, 1);
    }
  };
  
  // Calculate price after discount
  const finalPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
          {product.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">Featured</span>
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2">
              <span className="bg-accent text-white text-xs px-2 py-1 rounded">{product.discount}% OFF</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
          
          <div className="mt-1 flex items-center">
            <span className="text-xl font-bold text-gray-900">₹{finalPrice.toFixed(0)}</span>
            {product.discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>
          
          <div className="mt-1 flex items-center text-sm">
            <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
            
            <span className="mx-2 text-gray-300">•</span>
            
            <span className={`${product.isReturnable ? 'text-blue-600' : 'text-orange-600'} font-medium`}>
              {product.isReturnable ? 'Returnable' : 'Non-returnable'}
            </span>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          
          <button
            onClick={handleAddToCart}
            disabled={isInCart || product.stock <= 0}
            className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              isInCart
                ? 'bg-green-600 text-white cursor-default'
                : product.stock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Cart
              </>
            ) : product.stock <= 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;