import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';
import ProductList from '@/components/product/ProductList';
import ProductFilters from '@/components/product/ProductFilters';
import ProductSearch from '@/components/product/ProductSearch';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'createdAt';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = 12;

  return (
    <div className="container-custom py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
        </h1>
        {search && (
          <p className="text-gray-600 mt-2">
            Search results for: <span className="font-medium">"{search}"</span>
          </p>
        )}
      </header>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <ProductFilters selectedCategory={category} />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <ProductSearch initialQuery={search} />
          </div>
          
          {/* Product list with suspense for streaming */}
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          }>
            <ProductList 
              category={category}
              search={search}
              sort={sort}
              page={page}
              limit={limit}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}