import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCart, createCart, addToCart, removeFromCart, updateCartItemQuantity } from '@/lib/cart';

// Generate a random ID for new carts
function generateCartId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Get or create a cart for the current session
async function getOrCreateCart() {
  const cookieStore = cookies();
  let cartId = cookieStore.get('cartId')?.value;
  
  if (!cartId) {
    // Create a new cart if no cart ID exists
    cartId = generateCartId();
    cookieStore.set('cartId', cartId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    });
    
    await createCart();
  } else {
    // Verify cart exists
    const cart = await getCart(cartId);
    if (!cart) {
      // Create a new cart if the existing ID is invalid
      await createCart();
    }
  }
  
  return cartId;
}

export async function GET(request: NextRequest) {
  try {
    const cartId = await getOrCreateCart();
    const cart = await getCart(cartId);
    
    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cartId = await getOrCreateCart();
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: 'Invalid product ID or quantity' },
        { status: 400 }
      );
    }
    
    const updatedCart = await addToCart(cartId, productId, quantity);
    
    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cartId = await getOrCreateCart();
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity || quantity < 0) {
      return NextResponse.json(
        { message: 'Invalid product ID or quantity' },
        { status: 400 }
      );
    }
    
    const updatedCart = await updateCartItemQuantity(cartId, productId, quantity);
    
    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const cartId = await getOrCreateCart();
    const updatedCart = await removeFromCart(cartId, productId);
    
    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}