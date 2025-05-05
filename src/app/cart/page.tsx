import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getCart } from '@/lib/cart';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const cart = cartId ? await getCart(cartId) : null;
  const hasItems = cart && cart.items.length > 0;
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {hasItems ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Cart items */}
          <div className="md:col-span-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">Items ({cart.items.length})</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.productId}>
                    <CartItemRow item={item} />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Link href="/products" className="text-blue-600 hover:text-blue-500">
                ← Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Cart summary */}
          <div className="md:col-span-4">
            <CartSummary cart={cart} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-center mb-6">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-sm text-gray-500">
              Looks like you haven't added any products to your cart yet.
            </p>
          </div>
          <div>
            <Link href="/products" className="btn">
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}