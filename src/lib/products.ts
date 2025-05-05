'use server';

import { query, queryOne } from './db';
import type { Product } from '@/types/product';

// Get all products with optional filtering and pagination
export async function getProducts(options: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> {
  const { category, search, sort = 'created_at', page = 1, limit = 12 } = options;
  const offset = (page - 1) * limit;
  
  // Build where clause dynamically based on filters
  let whereClause = '';
  const params: any[] = [];
  
  if (category) {
    whereClause = 'WHERE category = $1';
    params.push(category);
  }
  
  if (search) {
    const searchParam = `%${search}%`;
    if (whereClause) {
      whereClause += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(searchParam);
    } else {
      whereClause = `WHERE (name ILIKE $1 OR description ILIKE $1)`;
      params.push(searchParam);
    }
  }
  
  // Get total count for pagination
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM products ${whereClause}`,
    params
  );
  const total = parseInt(countResult[0]?.count || '0');
  
  // Convert camelCase sort field to snake_case for database
  let dbSortField = sort;
  if (sort.startsWith('-')) {
    dbSortField = '-' + camelToSnakeCase(sort.substring(1));
  } else {
    dbSortField = camelToSnakeCase(sort);
  }
  
  // Add sorting and pagination
  const sortDirection = dbSortField.startsWith('-') ? 'DESC' : 'ASC';
  const sortField = dbSortField.startsWith('-') ? dbSortField.substring(1) : dbSortField;
  
  const productParams = [...params, limit, offset];
  const products = await query<Product>(
    `SELECT * FROM products 
     ${whereClause} 
     ORDER BY ${sortField} ${sortDirection}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    productParams
  );
  
  // Map database snake_case fields to camelCase for our application
  const mappedProducts = products.map(mapDatabaseProductToApp);
  
  return { products: mappedProducts, total };
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  const product = await queryOne<any>('SELECT * FROM products WHERE id = $1', [id]);
  return product ? mapDatabaseProductToApp(product) : null;
}

// Get a single product by slug (URL-friendly name)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await queryOne<any>('SELECT * FROM products WHERE slug = $1', [slug]);
  return product ? mapDatabaseProductToApp(product) : null;
}

// Get related products (same category, excluding current product)
export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  // Using created_at for consistent ordering instead of RANDOM()
  // This avoids the performance hit of ORDER BY RANDOM() which is very inefficient for large datasets
  const products = await query<any>(
    `SELECT * FROM products 
     WHERE category = (SELECT category FROM products WHERE id = $1) 
     AND id != $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [productId, limit]
  );
  
  return products.map(mapDatabaseProductToApp);
}

// Helper function to convert camelCase to snake_case
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Helper function to map database column names to our application model
function mapDatabaseProductToApp(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: Number(dbProduct.price), // Explicitly convert to a number
    images: dbProduct.images || [],
    category: dbProduct.category,
    attributes: dbProduct.attributes || {},
    inventory: dbProduct.inventory,
    slug: dbProduct.slug,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
}