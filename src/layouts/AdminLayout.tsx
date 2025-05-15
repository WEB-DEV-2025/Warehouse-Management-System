import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  PackageSearch
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Products', icon: <Package size={20} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-indigo-600 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-auto`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center px-4 h-16 border-b">
                <Link to="/admin" className="flex items-center">
                  <PackageSearch className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">Admin Panel</span>
                </Link>
              </div>
              
              <div className="flex-grow overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === item.path
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                      onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                      {location.pathname === item.path && (
                        <ChevronRight 
                          size={16} 
                          className="ml-auto text-indigo-600" 
                        />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {user?.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;