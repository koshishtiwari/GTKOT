import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import AddToCartButton from '@/components/product/AddToCartButton';
import { DEFAULT_IMAGE_URL } from '@/app/page'; // Import the default image constant

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  // Ensure price is always a number
  const price = typeof product.price === 'number' ? product.price : Number(product.price);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product images */}
        <div>
          <div className="rounded-lg overflow-hidden bg-gray-100 mb-6">
            <div className="relative aspect-square w-full max-h-[500px]">
              <Image
                src={product.images[0] || DEFAULT_IMAGE_URL}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          {/* Additional images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-50">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product details */}
        <div>
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900">
                  Products
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link 
                  href={`/products?category=${product.category}`} 
                  className="text-gray-500 hover:text-gray-900"
                >
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="text-2xl font-bold mb-6">${price.toFixed(2)}</div>
          
          <div className="prose prose-sm mb-6">
            <p>{product.description}</p>
          </div>
          
          {/* Product attributes */}
          {Object.keys(product.attributes).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Specifications</h3>
              <dl className="divide-y divide-gray-200">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="py-2 flex justify-between">
                    <dt className="text-gray-500">{key}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          
          {/* Inventory */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`h-4 w-4 rounded-full mr-2 ${
                product.inventory > 10
                  ? 'bg-green-500'
                  : product.inventory > 0
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`} />
              <span>
                {product.inventory > 10
                  ? 'In stock'
                  : product.inventory > 0
                  ? `Only ${product.inventory} left in stock`
                  : 'Out of stock'}
              </span>
            </div>
          </div>
          
          {/* Add to cart button */}
          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={product.inventory <= 0} />
          </div>
        </div>
      </div>
      
      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <Suspense fallback={<div>Loading related products...</div>}>
          <RelatedProducts productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Related products component
async function RelatedProducts({ productId }: { productId: string }) {
  const relatedProducts = await getRelatedProducts(productId);
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product) => {
        // Ensure price is always a number
        const price = typeof product.price === 'number' ? product.price : Number(product.price);
        
        return (
          <Link 
            key={product.id} 
            href={`/products/${product.slug}`}
            className="product-card block"
          >
            <div className="aspect-square w-full overflow-hidden bg-gray-200 relative mb-2">
              <Image
                src={product.images[0] || DEFAULT_IMAGE_URL}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain w-full h-full"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              ${price.toFixed(2)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}