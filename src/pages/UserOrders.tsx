import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import toast from 'react-hot-toast';

const UserOrders = () => {
  const { user } = useAuth();
  const { orders: allOrders, cancelOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Filter orders for current user
  const orders = allOrders.filter(order => order.userId === user?.id);

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
      toast.success('Order cancelled successfully');
    }
  };
  
  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
  
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
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
              >
                <Link to={`/orders/${order.id}`} className="block hover:bg-gray-50">
                  <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600">
                            Order #{order.id}
                          </p>
                          <span className="mx-2 text-gray-300">•</span>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleCancelOrder(order.id);
                              }}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">₹{order.total.toFixed(0)}</p>
                        <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex space-x-4 overflow-x-auto">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-20 w-20 object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      
                      {order.trackingNumber && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Tracking: {order.trackingNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;