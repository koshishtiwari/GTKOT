import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';
import { DEFAULT_IMAGE_URL } from '@/app/page';

interface ProductListProps {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export default async function ProductList({
  category,
  search,
  sort = 'createdAt',
  page = 1,
  limit = 12,
}: ProductListProps) {
  // Fetch products with the given filters
  const { products, total } = await getProducts({
    category,
    search,
    sort,
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="mt-4 text-xl font-medium text-gray-700">No products found</p>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <Link href="/products" className="mt-6 inline-block btn-outline text-indigo-600 border-indigo-600 hover:bg-indigo-50">
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{products.length}</span> of{' '}
          <span className="font-medium text-gray-700">{total}</span> products
        </p>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            className="form-control py-1 pl-3 pr-10 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue={sort}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('sort', e.target.value);
              window.location.href = url.toString();
            }}
          >
            <option value="createdAt">Newest</option>
            <option value="-createdAt">Oldest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

// Product card component
function ProductCard({ product }: { product: Product }) {
  // Ensure price is always a number
  const price = typeof product.price === 'number' ? product.price : Number(product.price);
  const isNew = new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
  
  return (
    <Link href={`/products/${product.slug}`} className="product-card group">
      <div className="product-image-container">
        <Image
          src={product.images[0] || DEFAULT_IMAGE_URL}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {isNew && (
          <span className="badge badge-primary absolute top-2 left-2 z-10">New</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-auto">
          <div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          <span className="text-lg font-semibold text-indigo-600 ml-2 flex-shrink-0">${price.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform duration-200">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  // Only show a limited number of page links
  const maxPageLinks = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);
  
  // Adjust if we're at the end
  if (endPage - startPage + 1 < maxPageLinks) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return (
    <nav className="flex items-center justify-center space-x-1">
      {/* Previous button */}
      <PaginationLink 
        page={currentPage > 1 ? currentPage - 1 : 1} 
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </PaginationLink>
      
      {/* First page and ellipsis if needed */}
      {startPage > 1 && (
        <>
          <PaginationLink 
            page={1} 
            aria-label="Page 1"
          >
            1
          </PaginationLink>
          {startPage > 2 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
        </>
      )}
      
      {/* Page links */}
      {pages.map((page) => (
        <PaginationLink 
          key={page} 
          page={page} 
          isActive={page === currentPage}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </PaginationLink>
      ))}
      
      {/* Last page and ellipsis if needed */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
          <PaginationLink 
            page={totalPages} 
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </PaginationLink>
        </>
      )}
      
      {/* Next button */}
      <PaginationLink 
        page={currentPage < totalPages ? currentPage + 1 : totalPages} 
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </PaginationLink>
    </nav>
  );
}

// Pagination link component
function PaginationLink({
  page,
  children,
  isActive = false,
  disabled = false,
  ...props
}: {
  page: number;
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  [key: string]: any;
}) {
  // Construct new URL with updated page parameter
  const href = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost');
  href.searchParams.set('page', page.toString());
  
  const className = `inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-sm rounded-md ${
    isActive
      ? 'bg-indigo-600 text-white'
      : disabled
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
  }`;
  
  if (disabled) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }
  
  return (
    <Link href={href.pathname + href.search} className={className} {...props}>
      {children}
    </Link>
  );
}