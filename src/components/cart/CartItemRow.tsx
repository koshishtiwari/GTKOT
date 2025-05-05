'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CartItem } from '@/types/cart';
import { DEFAULT_IMAGE_URL } from '@/app/page';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Ensure price is always a number
  const price = typeof item.price === 'number' ? item.price : Number(item.price);
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === quantity || newQuantity < 1 || isUpdating) return;
    
    setIsUpdating(true);
    setQuantity(newQuantity);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: newQuantity,
        }),
      });
      
      if (!response.ok) {
        // Revert to original quantity on error
        setQuantity(item.quantity);
        throw new Error('Failed to update item quantity');
      }
      
      // Refresh the page to show updated cart
      router.refresh();
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemoveItem = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    
    try {
      const response = await fetch(`/api/cart?productId=${item.productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      // Refresh the page to show updated cart
      router.refresh();
    } catch (error) {
      console.error('Error removing cart item:', error);
      setIsRemoving(false);
    }
  };
  
  return (
    <div className="p-6 flex flex-col sm:flex-row">
      {/* Product image */}
      <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden bg-gray-50">
          <Image
            src={item.image || DEFAULT_IMAGE_URL}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 96px, 128px"
            className="object-contain"
          />
        </div>
      </div>
      
      {/* Product details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <Link 
              href={`/products/${item.productId}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              ${price.toFixed(2)} each
            </p>
          </div>
          <p className="text-lg font-medium text-gray-900">
            ${(price * quantity).toFixed(2)}
          </p>
        </div>
        
        <div className="mt-auto pt-4 flex justify-between items-center">
          {/* Quantity controls */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transform active:scale-90 transition-all duration-150"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            <span className={`mx-2 w-8 text-center font-medium ${isUpdating ? 'opacity-50' : ''}`}>
              {quantity}
            </span>
            
            <button
              type="button"
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transform active:scale-90 transition-all duration-150"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
              aria-label="Increase quantity"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Remove button with loading state */}
          <button
            type="button"
            className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors duration-150 group"
            onClick={handleRemoveItem}
            disabled={isRemoving}
            aria-label="Remove item from cart"
          >
            <span className="relative">
              {isRemoving ? (
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">Remove</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}