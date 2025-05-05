export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  attributes: Record<string, string>;
  inventory: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}