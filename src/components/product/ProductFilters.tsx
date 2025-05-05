'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'books', name: 'Books' },
  { id: 'sports', name: 'Sports & Outdoors' },
];

const SORT_OPTIONS = [
  { id: 'createdAt', name: 'Newest' },
  { id: 'price', name: 'Price: Low to High' },
  { id: '-price', name: 'Price: High to Low' },
  { id: 'name', name: 'Name: A to Z' },
];

interface ProductFiltersProps {
  selectedCategory?: string;
}

export default function ProductFilters({ selectedCategory }: ProductFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'createdAt';
  
  // Create a new URL with the updated parameters
  const createUrl = (params: { [key: string]: string | null }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    }
    
    return `${pathname}?${newParams.toString()}`;
  };
  
  return (
    <div className="space-y-8">
      {/* Categories filter */}
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <ul className="space-y-3">
          <li>
            <Link
              href={createUrl({ category: null })}
              className={`block hover:text-blue-600 ${
                !selectedCategory ? 'font-medium text-blue-600' : 'text-gray-600'
              }`}
            >
              All Categories
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={createUrl({ category: category.id })}
                className={`block hover:text-blue-600 ${
                  selectedCategory === category.id ? 'font-medium text-blue-600' : 'text-gray-600'
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Sort options */}
      <div>
        <h3 className="text-lg font-medium mb-4">Sort By</h3>
        <ul className="space-y-3">
          {SORT_OPTIONS.map((option) => (
            <li key={option.id}>
              <Link
                href={createUrl({ sort: option.id })}
                className={`block hover:text-blue-600 ${
                  currentSort === option.id ? 'font-medium text-blue-600' : 'text-gray-600'
                }`}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}