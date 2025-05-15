import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, ChevronDown } from 'lucide-react';
import { updateOrderStatus } from '../../data/orders';
import { Order } from '../../types/Order';
import toast from 'react-hot-toast';
import { useOrders } from '../../contexts/OrderContext';

const Orders = () => {
  const { orders, updateOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      updateOrder(orderId, { 
        status: newStatus as any,
        updatedAt: new Date().toISOString()
      });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Orders List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sortedOrders.map((order, index) => (
            <motion.li
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm font-medium text-indigo-600">
                        Order #{order.id}
                      </p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm font-medium rounded-full px-3 py-1 ${getStatusColor(order.status)} border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{order.total.toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="ml-6 text-gray-400 hover:text-gray-500"
                    >
                      <ChevronDown
                        className={`h-5 w-5 transform transition-transform ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 border-t border-gray-200 pt-6"
                  >
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                      <ul className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <li key={item.product.id} className="py-4 flex">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-16 w-16 rounded object-cover"
                            />
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  ₹{(item.price * item.quantity).toFixed(0)}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Customer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Delivery Address
                        </h4>
                        <div className="text-sm text-gray-500">
                          <p>{order.deliveryAddress.fullName}</p>
                          <p>{order.deliveryAddress.addressLine1}</p>
                          {order.deliveryAddress.addressLine2 && (
                            <p>{order.deliveryAddress.addressLine2}</p>
                          )}
                          <p>
                            {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                          </p>
                          <p className="mt-2">Phone: {order.deliveryAddress.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Order Summary
                        </h4>
                        <dl className="space-y-2 text-sm text-gray-500">
                          <div className="flex justify-between">
                            <dt>Subtotal</dt>
                            <dd className="font-medium text-gray-900">
                              ₹{order.subtotal.toFixed(0)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>Delivery Fee</dt>
                            <dd className="font-medium text-gray-900">
                              {order.deliveryFee === 0 ? (
                                <span className="text-green-600">Free</span>
                              ) : (
                                `₹${order.deliveryFee.toFixed(0)}`
                              )}
                            </dd>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between">
                              <dt>Discount</dt>
                              <dd className="font-medium text-green-600">
                                -₹{order.discount.toFixed(0)}
                              </dd>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <dt className="font-medium text-gray-900">Total</dt>
                            <dd className="font-medium text-gray-900">
                              ₹{order.total.toFixed(0)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orders;