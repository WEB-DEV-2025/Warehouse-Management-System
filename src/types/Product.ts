export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  isReturnable: boolean;
  featured?: boolean;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

// Categories for products
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Toys',
  'Books',
  'Kitchen',
  'Sports',
  'Tools'
];