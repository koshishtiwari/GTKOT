-- Database schema for Momo e-commerce application

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  attributes JSONB NOT NULL DEFAULT '{}',
  inventory INT NOT NULL DEFAULT 0,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_products_slug ON products(slug);
-- Create index on category for filtering
CREATE INDEX idx_products_category ON products(category);
-- Create index for full text search
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || description));

-- Create carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id)
);

-- Create index on cart_id for faster cart item lookups
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_intent VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on order_id for faster order item lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Create sample product data
INSERT INTO products (name, description, price, images, category, attributes, inventory, slug) VALUES
(
  'Ultra Lightweight Laptop',
  'High-performance laptop with 16-inch display, 16GB RAM, and 512GB SSD. Perfect for professionals and creators.',
  1299.99,
  ARRAY['https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&h=800'],
  'electronics',
  '{"processor":"Intel Core i7", "memory":"16GB", "storage":"512GB SSD", "display":"16-inch Retina", "battery":"Up to 10 hours"}',
  25,
  'ultra-lightweight-laptop'
),
(
  'Wireless Noise-Cancelling Headphones',
  'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
  249.99,
  ARRAY['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800'],
  'electronics',
  '{"type":"Over-ear", "wireless":"Yes", "battery":"30 hours", "noise-cancelling":"Yes", "color":"Black"}',
  50,
  'wireless-noise-cancelling-headphones'
),
(
  'Organic Cotton T-Shirt',
  'Soft, comfortable t-shirt made from 100% organic cotton. Sustainable and eco-friendly.',
  29.99,
  ARRAY['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&h=800'],
  'clothing',
  '{"material":"100% Organic Cotton", "fit":"Regular", "size":"Medium", "color":"Blue", "care":"Machine wash cold"}',
  100,
  'organic-cotton-t-shirt'
),
(
  'Ergonomic Office Chair',
  'Fully adjustable ergonomic office chair with lumbar support, adjustable arms, and breathable mesh back.',
  199.99,
  ARRAY['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&h=800'],
  'home',
  '{"material":"Mesh and high-density foam", "weight_capacity":"300 lbs", "adjustable":"Yes", "color":"Black", "assembly_required":"Yes"}',
  15,
  'ergonomic-office-chair'
),
(
  'Smart Fitness Watch',
  'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
  179.99,
  ARRAY['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&h=800'],
  'electronics',
  '{"display":"1.4 inch AMOLED", "water_resistant":"50m", "battery":"7 days", "sensors":"Heart rate, GPS, accelerometer", "compatibility":"iOS, Android"}',
  35,
  'smart-fitness-watch'
),
(
  'Bestselling Novel',
  'The latest bestselling novel from a renowned author. A thrilling page-turner that will keep you engaged until the last page.',
  19.99,
  ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=800'],
  'books',
  '{"author":"Jane Smith", "pages":"384", "publisher":"Penguin Books", "language":"English", "format":"Hardcover"}',
  200,
  'bestselling-novel'
),
(
  'Yoga Mat',
  'High-density, non-slip yoga mat with alignment lines. Perfect for yoga, pilates, and other floor exercises.',
  49.99,
  ARRAY['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&h=800'],
  'sports',
  '{"material":"TPE", "thickness":"6mm", "dimensions":"72\" x 24\"", "non-slip":"Yes", "eco-friendly":"Yes"}',
  40,
  'yoga-mat'
),
(
  'Stainless Steel Water Bottle',
  'Double-walled, vacuum-insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
  34.99,
  ARRAY['https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&h=800', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&h=800'],
  'home',
  '{"capacity":"24 oz", "material":"18/8 Stainless Steel", "insulation":"Double-walled vacuum", "dishwasher_safe":"No", "color":"Silver"}',
  75,
  'stainless-steel-water-bottle'
);