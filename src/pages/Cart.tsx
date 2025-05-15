import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, deliveryFee, discount, grandTotal, applyCoupon, removeCoupon, appliedCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };
  
  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const success = applyCoupon(couponCode);
    
    if (success) {
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code or minimum order amount not met');
    }
  };
  
  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 ${index !== 0 ? 'border-t border-gray-200' : ''}`}
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.product.id}`} className="hover:text-indigo-600">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-lg font-medium text-gray-900">
                          ₹{(item.product.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.product.id}`} className="sr-only">
                            Quantity
                          </label>
                          <select
                            id={`quantity-${item.product.id}`}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                            className="rounded-md border-gray-300 py-1.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            {[...Array(Math.min(5, item.product.stock))].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="ml-4 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="bg-green-50 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-green-600" />
                        <span className="ml-2 text-sm font-medium text-green-700">
                          Coupon {appliedCoupon} applied
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 input"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="btn btn-primary"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-sm text-red-600">{couponError}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Use SAVE50 for ₹50 off on orders above ₹300
                    </p>
                    <p className="text-sm text-gray-500">
                      Use SAVE100 for ₹100 off on orders above ₹500
                    </p>
                  </div>
                )}
              </div>
              
              {/* Price Details */}
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Delivery Fee</dt>
                    <dd className="font-medium text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${deliveryFee.toFixed(0)}`
                      )}
                    </dd>
                  </div>
                  
                  {discount > 0 && (
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Discount</dt>
                      <dd className="font-medium text-green-600">-₹{discount.toFixed(0)}</dd>
                    </div>
                  )}
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Order Total</dt>
                    <dd className="text-base font-medium text-gray-900">₹{grandTotal.toFixed(0)}</dd>
                  </div>
                </dl>
              </div>
              
              <button
                onClick={handleCheckout}
                className="mt-6 w-full btn btn-primary"
              >
                Proceed to Checkout
              </button>
              
              {/* Free Delivery Notice */}
              {subtotal < 100 && (
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Add items worth ₹{(100 - subtotal).toFixed(0)} more for free delivery
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;