import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Available coupons
const COUPONS = {
  'SAVE50': { amount: 50, minOrder: 300 },
  'SAVE100': { amount: 100, minOrder: 500 }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('wms_cart');
    const savedCoupon = localStorage.getItem('wms_coupon');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart', error);
      }
    }
    
    if (savedCoupon) {
      setAppliedCoupon(savedCoupon);
    }
  }, []);
  
  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('wms_cart', JSON.stringify(items));
  }, [items]);
  
  // Save coupon to localStorage on change
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('wms_coupon', appliedCoupon);
    } else {
      localStorage.removeItem('wms_coupon');
    }
  }, [appliedCoupon]);
  
  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  // Delivery fee: free for orders above ₹100, otherwise ₹10
  const deliveryFee = subtotal > 100 ? 0 : 10;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon as keyof typeof COUPONS]) {
    const coupon = COUPONS[appliedCoupon as keyof typeof COUPONS];
    if (subtotal >= coupon.minOrder) {
      discount = coupon.amount;
    }
  }
  
  const grandTotal = subtotal + deliveryFee - discount;
  
  // Add to cart
  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  };
  
  // Remove from cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };
  
  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };
  
  // Apply coupon
  const applyCoupon = (code: string) => {
    const coupon = COUPONS[code as keyof typeof COUPONS];
    
    if (!coupon) {
      return false;
    }
    
    if (subtotal < coupon.minOrder) {
      return false;
    }
    
    setAppliedCoupon(code);
    return true;
  };
  
  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};