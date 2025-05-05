export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  slug: string; // Add slug for proper navigation
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}