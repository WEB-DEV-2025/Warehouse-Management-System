import { Product } from './Product';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of purchase
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DeliveryAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'cod' | 'card' | 'upi';
  trackingNumber?: string;
}