import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types/Order';
import { getAllOrders, updateOrderStatus } from '../data/orders';

interface OrderContextType {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const addOrder = (order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
    startOrderTimer(order.id);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, 'cancelled');
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const startOrderTimer = (orderId: string) => {
    // Update to processing after payment (1 second)
    setTimeout(async () => {
      try {
        const updatedOrder = await updateOrderStatus(orderId, 'processing');
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
          )
        );
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }, 1000);

    // Update to shipped after 2 minutes
    setTimeout(async () => {
      try {
        const updatedOrder = await updateOrderStatus(orderId, 'shipped');
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
          )
        );
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }, 2 * 60 * 1000);

    // Update to delivered after 10 minutes
    setTimeout(async () => {
      try {
        const updatedOrder = await updateOrderStatus(orderId, 'delivered');
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? updatedOrder : order
          )
        );
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }, 10 * 60 * 1000);
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrder, addOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};