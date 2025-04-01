export interface ProductImage {
  id: number;
  imagePath: string;
  url?: string;
  orderIndex: number;
  altText: string | null;
  primary: boolean;
  createdAt?: string;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceModifier: number;
  images: ProductImage[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductLink {
  id: number;
  slug: string;
  active: boolean;
  clicks: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  salePrice: number;
  stock: number;
  active: boolean;
  variants: ProductVariant[];
  productLink: ProductLink;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ProductRequest {
  name: string;
  description?: string;
  basePrice: number;
  salePrice: number;
  stock?: number;
  variants?: ProductVariantRequest[];
}

export interface ProductVariantRequest {
  size: string;
  color: string;
  stock: number;
  priceModifier: number;
}