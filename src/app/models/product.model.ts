export interface ProductVariant {
  id?: string;
  name: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  salePrice: number;
  stock: number;
  variants?: ProductVariant[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
} 