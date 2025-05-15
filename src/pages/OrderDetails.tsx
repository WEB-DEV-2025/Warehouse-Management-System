import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getOrderById } from '../data/orders';
import { Order } from '../types/Order';

const OrderDetails = () => {
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
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
          <Link to="/orders" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/orders" className="text-indigo-600 hover:text-indigo-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                  <Clock className="h-4 w-4 ml-4 mr-1" />
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Order Progress */}
          {order.status !== 'cancelled' && (
            <div className="px-6 py-8 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-between">
                  {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                    const isCompleted = ['delivered', 'shipped', 'processing'].includes(order.status) && index < ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                    const isCurrent = order.status === step;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
                            isCompleted
                              ? 'bg-indigo-600'
                              : isCurrent
                              ? 'bg-indigo-600'
                              : 'bg-gray-300'
                          }`}
                        >
                          <Package className={`h-5 w-5 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <p className={`mt-2 text-xs font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Tracking Number: {order.trackingNumber}
                      </p>
                      {order.shippedAt && (
                        <p className="mt-1 text-sm text-gray-500">
                          Shipped on {new Date(order.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Order Items */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <motion.li
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-6 flex"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          <Link
                            to={`/products/${item.product.id}`}
                            className="hover:text-indigo-600"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-base font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Delivery Address */}
          <div className="px-6 py-8 border-b border-gray-200">
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
          
          {/* Payment Details */}
          <div className="px-6 py-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Payment Method</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {order.paymentMethod.toUpperCase()}
                </dd>
              </div>
              
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
    </div>
  );
};

export default OrderDetails;