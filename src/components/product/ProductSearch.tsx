'use client';

import { useState, FormEvent } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ProductSearchProps {
  initialQuery?: string;
}

export default function ProductSearch({ initialQuery = '' }: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove search parameter
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    // Reset to page 1 when searching
    params.delete('page');
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="form-control pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="absolute inset-y-0 left-0 pl-3 flex items-center"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {query && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
}