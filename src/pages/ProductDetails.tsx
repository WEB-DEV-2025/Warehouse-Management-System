import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getProductById } from '../data/products';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const isInCart = items.some(item => item.product.id === id);
  
  const handleAddToCart = () => {
    if (product && !isInCart) {
      addToCart(product, quantity);
      toast.success('Added to cart!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate final price after discount
  const finalPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-w-1 aspect-h-1 w-full"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
          {product.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            </div>
          )}
          {product.discount && (
            <div className="absolute top-4 right-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                {product.discount}% OFF
              </span>
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3 flex items-center">
            <p className="text-3xl font-bold text-gray-900">₹{finalPrice.toFixed(0)}</p>
            {product.discount && (
              <p className="ml-3 text-lg text-gray-500 line-through">₹{product.price}</p>
            )}
          </div>
          
          <div className="mt-6">
            <p className="text-lg text-gray-600">{product.description}</p>
          </div>
          
          <div className="mt-8 space-y-6">
            {/* Stock Status */}
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 py-1.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {[...Array(Math.min(5, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isInCart || product.stock <= 0}
              className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                isInCart
                  ? 'bg-green-600 cursor-not-allowed'
                  : product.stock <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isInCart ? (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Added to Cart
                </>
              ) : product.stock <= 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
          
          {/* Product Features */}
          <div className="mt-10 border-t border-gray-200 pt-10">
            <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-indigo-600 mt-1" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                  <p className="mt-1 text-sm text-gray-500">On orders above ₹100</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <RotateCcw className="h-5 w-5 text-indigo-600 mt-1" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {product.isReturnable ? 'Returnable' : 'Non-Returnable'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.isReturnable 
                      ? 'This item can be returned within 7 days'
                      : 'This item cannot be returned'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;