// Mock orders for demo
export const MOCK_ORDERS: Order[] = [];

let orders = [...MOCK_ORDERS];

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return orders;
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | undefined> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return orders.find(order => order.id === id);
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return orders.filter(order => order.userId === userId);
};

// Create new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();
  
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${orderNumber}`,
    createdAt: now,
    updatedAt: now
  };
  
  orders = [...orders, newOrder];
  return newOrder;
};

// Update order status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Order not found');
  }
  
  const now = new Date().toISOString();
  const updatedOrder: Order = {
    ...orders[index],
    status,
    updatedAt: now,
    ...(status === 'shipped' && !orders[index].shippedAt ? { shippedAt: now } : {}),
    ...(status === 'delivered' && !orders[index].deliveredAt ? { deliveredAt: now } : {})
  };
  
  orders = [
    ...orders.slice(0, index),
    updatedOrder,
    ...orders.slice(index + 1)
  ];
  
  return updatedOrder;
};

// Cancel order
export const cancelOrder = async (id: string): Promise<Order> => {
  return updateOrderStatus(id, 'cancelled');
};