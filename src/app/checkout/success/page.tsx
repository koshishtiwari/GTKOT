'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Create a custom event to notify the cart counter to update
  useEffect(() => {
    // Dispatch an event to update the cart counter in the header
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container-custom max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="text-lg font-medium">{orderId}</p>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            We've sent you an email with your order details and will notify you when your order has shipped.
          </p>

          <div className="space-y-4">
            <Link href="/products" className="btn block">
              Continue Shopping
            </Link>
            
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 inline-block">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}