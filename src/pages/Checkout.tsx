import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../data/orders';
import toast from 'react-hot-toast';
import { useOrders } from '../contexts/OrderContext';

interface DeliveryFormData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

const Checkout = () => {
  const { items, subtotal, deliveryFee, discount, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('cod');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryFormData>({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const orderData = {
        userId: user!.id,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        })),
        status: 'pending' as const,
        subtotal,
        deliveryFee,
        discount,
        total: grandTotal,
        deliveryAddress: deliveryInfo,
        paymentMethod
      };
      
      const order = await createOrder(orderData);
      
      // Add order to context for real-time updates
      addOrder(order);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const paymentMethods = [
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <Truck className="h-5 w-5 text-gray-400" />
    },
    {
      id: 'card',
      title: 'Credit/Debit Card',
      description: 'Secure payment with credit or debit card',
      icon: <CreditCard className="h-5 w-5 text-gray-400" />
    },
    {
      id: 'upi',
      title: 'UPI',
      description: 'Pay using UPI apps like Google Pay, PhonePe',
      icon: <Phone className="h-5 w-5 text-gray-400" />
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order by providing delivery and payment details</p>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Delivery and Payment Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit}>
              {/* Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-sm rounded-lg p-6 mb-8"
              >
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Delivery Information</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={deliveryInfo.addressLine1}
                      onChange={handleInputChange}
                      required
                      className="mt-1 input"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={deliveryInfo.addressLine2}
                      onChange={handleInputChange}
                      className="mt-1 input"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={deliveryInfo.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={deliveryInfo.postalCode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 input"
                        pattern="[0-9]{6}"
                        title="Please enter a valid 6-digit postal code"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1 input"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white shadow-sm rounded-lg p-6"
              >
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <input
                        type="radio"
                        name="payment-method"
                        id={method.id}
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={method.id}
                        className={`block w-full rounded-lg border ${
                          paymentMethod === method.id
                            ? 'border-indigo-600 ring-2 ring-indigo-600'
                            : 'border-gray-300'
                        } p-4 cursor-pointer hover:border-indigo-600 transition-colors`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">{method.icon}</div>
                          <div>
                            <p className="font-medium text-gray-900">{method.title}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            </form>
          </div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 lg:mt-0 lg:col-span-5"
          >
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.product.id} className="py-6 flex">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(item.product.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Details */}
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(0)}</dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Delivery Fee</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(0)}`
                    )}
                  </dd>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Discount</dt>
                    <dd className="text-sm font-medium text-green-600">
                      -₹{discount.toFixed(0)}
                    </dd>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Order Total</dt>
                  <dd className="text-base font-medium text-gray-900">₹{grandTotal.toFixed(0)}</dd>
                </div>
              </dl>
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-6 w-full btn btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;