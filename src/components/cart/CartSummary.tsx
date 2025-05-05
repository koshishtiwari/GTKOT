'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Cart } from '@/types/cart';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Ensure subtotal is always a number
  const subtotal = typeof cart.subtotal === 'number' ? cart.subtotal : Number(cart.subtotal);
  
  // Calculate estimated tax (simplified for demo)
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + tax;
  
  // Simplified function to initiate checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // In a real implementation, this would create an order and redirect to checkout
      // For this minimal demo, we'll just simulate by redirecting to a placeholder page
      router.push('/checkout');
    } catch (error) {
      console.error('Error starting checkout:', error);
      setIsCheckingOut(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden sticky top-20">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Order Summary</h2>
      </div>
      
      <div className="px-6 py-4 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-base">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-base">
          <p>Estimated Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>
        
        {/* Total */}
        <div className="flex justify-between text-lg font-medium border-t pt-4">
          <p>Order Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
        
        {/* Checkout button */}
        <div className="mt-6">
          <button
            type="button"
            className="btn w-full"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <span className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
        </div>
        
        {/* Secure checkout message */}
        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          Secure Checkout
        </div>
      </div>
    </div>
  );
}