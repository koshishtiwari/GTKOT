import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';

// Fallback sample products for development when database isn't available
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium noise-cancelling wireless headphones',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
    category: 'electronics',
    attributes: {
      color: 'Black',
      wireless: 'Yes',
      batteryLife: '20 hours'
    },
    inventory: 10,
    slug: 'premium-wireless-headphones',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Designer Watch',
    description: 'Elegant timepiece with premium materials and precise movement',
    price: 349.99,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'],
    category: 'accessories',
    attributes: {
      material: 'Stainless Steel',
      waterResistant: 'Yes'
    },
    inventory: 5,
    slug: 'designer-watch',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'],
    category: 'home',
    attributes: {
      material: 'Aluminum',
      adjustable: 'Yes',
      powerSource: 'USB-C'
    },
    inventory: 15,
    slug: 'minimalist-desk-lamp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Premium Leather Backpack',
    description: 'Handcrafted genuine leather backpack with multiple compartments',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'],
    category: 'accessories',
    attributes: {
      material: 'Genuine Leather',
      waterResistant: 'Yes',
      laptopCompartment: 'Yes'
    },
    inventory: 8,
    slug: 'premium-leather-backpack',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Default fallback image URL
export const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60';

// Hero background image URL
export const HERO_BG_URL = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1920&q=80';

export default async function Home() {
  // Try to get featured products, with fallback for database connection issues
  let products: Product[] = [];
  let dbError = false;
  
  try {
    const result = await getProducts({ limit: 4 });
    products = result.products;
  } catch (error) {
    console.error('Failed to fetch products from database:', error);
    products = fallbackProducts;
    dbError = true;
  }
  
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center animate-subtle-zoom" 
             style={{ backgroundImage: `url('${HERO_BG_URL}')` }}></div>
        
        <div className="container-custom relative z-20 h-full flex flex-col justify-center items-start">
          <div className="max-w-xl md:max-w-2xl animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              <span className="text-primary-500">Shop</span> the Future, <br />Today
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-6 md:mb-8 max-w-lg">
              Discover our premium selection of high-quality products, designed for modern living.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary px-6 py-2 md:px-8 md:py-3 rounded-full hover:scale-105 transition-transform">
                Shop Now
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-white/10 transition-all">
                Our Story
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
      
      {/* Database connection warning - only shown when there's an error */}
      {dbError && (
        <div className="container-custom py-3 mt-6">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Database connection error. Make sure your PostgreSQL database is running and configured correctly.
                  <br />
                  Currently showing sample products for development.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Categories section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <CategoryCard 
              title="Electronics" 
              description="Cutting-edge gadgets and devices"
              image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
              link="/products?category=electronics"
            />
            <CategoryCard 
              title="Fashion" 
              description="Stylish clothing and accessories"
              image="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
              link="/products?category=clothing"
            />
            <CategoryCard 
              title="Home & Living" 
              description="Beautiful items for your space"
              image="https://images.unsplash.com/photo-1584346133934-fdd45f799241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
              link="/products?category=home"
            />
          </div>
        </div>
      </section>
      
      {/* Featured products section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
            <div>
              <span className="badge badge-primary uppercase tracking-wider font-semibold text-xs py-1 px-3">Curated Selection</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl mt-2">
                Discover our handpicked selection of premium items that combine quality, style, and exceptional value
              </p>
            </div>
            <Link href="/products" className="hidden md:flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors mt-4 md:mt-0">
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="btn-outline text-indigo-600 border-indigo-600 hover:bg-indigo-50 px-6 py-2 inline-flex items-center justify-center rounded-full">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Feature highlights section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-primary uppercase tracking-wider font-semibold text-xs py-1 px-3">Why Choose Us</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">Exceptional Shopping Experience</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              We've crafted every aspect of our platform to deliver the best online shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Lightning Fast</h3>
              <p className="mt-2 md:mt-3 text-gray-600 text-sm md:text-base">
                Built with Next.js App Router and React Server Components for incredible performance and instant page loads.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Optimized Images</h3>
              <p className="mt-2 md:mt-3 text-gray-600 text-sm md:text-base">
                Automatically optimized product images that load quickly and look crisp on any device or screen size.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Secure Checkout</h3>
              <p className="mt-2 md:mt-3 text-gray-600 text-sm md:text-base">
                State-of-the-art security protocols to keep your personal and payment information safe at all times.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter subscription section */}
      <section className="py-12 md:py-16 lg:py-20 bg-indigo-700 text-white">
        <div className="container-custom">
          <div className="max-w-xl md:max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Stay in the Loop</h2>
            <p className="text-indigo-100 mb-6 md:mb-8 text-sm md:text-base">
              Subscribe to our newsletter for exclusive deals, new arrivals, and insider tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="form-control flex-grow bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white"
                required 
              />
              <button 
                type="submit" 
                className="btn bg-white text-indigo-700 hover:bg-indigo-50 focus:ring-white/50"
              >
                Subscribe
              </button>
            </form>
            <p className="text-indigo-200 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Product card component with enhanced styling
function ProductCard({ product }: { product: Product }) {
  // Ensure price is always a number
  const price = typeof product.price === 'number' ? product.price : Number(product.price);
  
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-image-container">
        <Image
          src={product.images[0] || DEFAULT_IMAGE_URL}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-auto">
          <div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          <span className="text-lg font-semibold text-indigo-600 ml-2 flex-shrink-0">${price.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500 capitalize">
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

// Category card component
function CategoryCard({ 
  title, 
  description, 
  image, 
  link 
}: { 
  title: string;
  description: string;
  image: string;
  link: string;
}) {
  return (
    <Link href={link} className="group relative rounded-xl overflow-hidden h-64 block">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 mb-4 text-sm md:text-base">{description}</p>
        <span className="inline-flex items-center text-sm font-medium text-white bg-white/20 rounded-full py-1.5 px-4 group-hover:bg-white/30 transition-colors">
          Shop Now
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}