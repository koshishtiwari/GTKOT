'use server';

import { query, queryOne, transaction } from './db';
import type { Cart, CartItem } from '@/types/cart';
import { getProduct } from './products';

// Get cart by ID
export async function getCart(cartId: string): Promise<Cart | null> {
  const cart = await queryOne<Cart>('SELECT * FROM carts WHERE id = $1', [cartId]);
  
  if (!cart) return null;
  
  // Get cart items
  const items = await query<CartItem>(
    'SELECT * FROM cart_items WHERE cart_id = $1',
    [cartId]
  );
  
  return {
    ...cart,
    items,
  };
}

// Create a new empty cart
export async function createCart(): Promise<Cart> {
  const now = new Date().toISOString();
  const cart = await queryOne<Cart>(
    'INSERT INTO carts (created_at, updated_at, subtotal) VALUES ($1, $1, 0) RETURNING *',
    [now]
  );
  
  if (!cart) throw new Error('Failed to create cart');
  
  return {
    ...cart,
    items: [],
  };
}

// Add item to cart
export async function addToCart(cartId: string, productId: string, quantity: number): Promise<Cart> {
  return transaction(async (client) => {
    // Get product to ensure it exists and to get current price
    const product = await getProduct(productId);
    if (!product) throw new Error('Product not found');
    if (product.inventory < quantity) throw new Error('Not enough inventory');
    
    // Check if item already exists in cart
    const existingItem = await queryOne<CartItem>(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId],
      client
    );
    
    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;
      await client.query(
        'UPDATE cart_items SET quantity = $1, updated_at = $2 WHERE cart_id = $3 AND product_id = $4',
        [newQuantity, new Date().toISOString(), cartId, productId]
      );
    } else {
      // Add new item if it doesn't exist
      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price, name, image) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [cartId, productId, quantity, product.price, product.name, product.images[0]]
      );
    }
    
    // Recalculate cart subtotal
    const items = await query<CartItem>(
      'SELECT * FROM cart_items WHERE cart_id = $1',
      [cartId],
      client
    );
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart with new subtotal and timestamp
    await client.query(
      'UPDATE carts SET subtotal = $1, updated_at = $2 WHERE id = $3',
      [subtotal, new Date().toISOString(), cartId]
    );
    
    // Return updated cart
    const updatedCart = await queryOne<Cart>(
      'SELECT * FROM carts WHERE id = $1',
      [cartId],
      client
    );
    
    if (!updatedCart) throw new Error('Cart not found');
    
    return {
      ...updatedCart,
      items,
    };
  });
}

// Remove item from cart
export async function removeFromCart(cartId: string, productId: string): Promise<Cart> {
  return transaction(async (client) => {
    // Delete item from cart
    await client.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );
    
    // Recalculate cart subtotal
    const items = await query<CartItem>(
      'SELECT * FROM cart_items WHERE cart_id = $1',
      [cartId],
      client
    );
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart with new subtotal and timestamp
    await client.query(
      'UPDATE carts SET subtotal = $1, updated_at = $2 WHERE id = $3',
      [subtotal, new Date().toISOString(), cartId]
    );
    
    // Return updated cart
    const updatedCart = await queryOne<Cart>(
      'SELECT * FROM carts WHERE id = $1',
      [cartId],
      client
    );
    
    if (!updatedCart) throw new Error('Cart not found');
    
    return {
      ...updatedCart,
      items,
    };
  });
}

// Update item quantity in cart
export async function updateCartItemQuantity(
  cartId: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  if (quantity <= 0) {
    return removeFromCart(cartId, productId);
  }
  
  return transaction(async (client) => {
    // Get product to ensure it exists and has enough inventory
    const product = await getProduct(productId);
    if (!product) throw new Error('Product not found');
    if (product.inventory < quantity) throw new Error('Not enough inventory');
    
    // Update quantity
    await client.query(
      'UPDATE cart_items SET quantity = $1, updated_at = $2 WHERE cart_id = $3 AND product_id = $4',
      [quantity, new Date().toISOString(), cartId, productId]
    );
    
    // Recalculate cart subtotal
    const items = await query<CartItem>(
      'SELECT * FROM cart_items WHERE cart_id = $1',
      [cartId],
      client
    );
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart with new subtotal and timestamp
    await client.query(
      'UPDATE carts SET subtotal = $1, updated_at = $2 WHERE id = $3',
      [subtotal, new Date().toISOString(), cartId]
    );
    
    // Return updated cart
    const updatedCart = await queryOne<Cart>(
      'SELECT * FROM carts WHERE id = $1',
      [cartId],
      client
    );
    
    if (!updatedCart) throw new Error('Cart not found');
    
    return {
      ...updatedCart,
      items,
    };
  });
}