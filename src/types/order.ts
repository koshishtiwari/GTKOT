export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentIntent?: string;
  createdAt: string;
  updatedAt: string;
}