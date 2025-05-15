import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { getOrderById } from '../data/orders';
import { Order } from '../types/Order';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id!);
        setOrder(data || null);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-lg overflow-hidden"
        >
          {/* Order Status Header */}
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-indigo-100">
              Thank you for your order. We'll send you shipping confirmation soon.
            </p>
          </div>
          
          {/* Order Details */}
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Order number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Order date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Order status</dt>
                    <dd className="mt-1 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.paymentMethod.toUpperCase()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.product.id} className="py-4 flex">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Delivery Address */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {order.deliveryAddress.fullName}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.deliveryAddress.addressLine1}
                      {order.deliveryAddress.addressLine2 && (
                        <>, {order.deliveryAddress.addressLine2}</>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Phone: {order.deliveryAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">₹{order.subtotal.toFixed(0)}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Delivery Fee</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {order.deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${order.deliveryFee.toFixed(0)}`
                      )}
                    </dd>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Discount</dt>
                      <dd className="text-sm font-medium text-green-600">
                        -₹{order.discount.toFixed(0)}
                      </dd>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Order Total</dt>
                    <dd className="text-base font-medium text-gray-900">₹{order.total.toFixed(0)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                to="/orders"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View All Orders
              </Link>
              <Link to="/" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;