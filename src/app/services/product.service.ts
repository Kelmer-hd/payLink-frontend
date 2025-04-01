import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse, Product, ProductVariant } from '../interfaces/product.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

// Definir interfaz para los criterios de búsqueda
interface SearchCriteria {
  query?: string;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/products`;
  private imageBaseUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  getProducts(page: number = 0, size: number = 10, sort: string = 'createdAt,desc', search?: string): Observable<ApiResponse<any>> {
    let [sortBy, direction] = sort.split(','); // Dividir el string de ordenación
    if (!direction) { // Si no hay dirección, usar 'desc' por defecto
      direction = 'desc';
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)  
      .set('direction', direction); 

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<any>>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/slug/${slug}`);
  }

  createProduct(product: Partial<Product>, productImages: File[], variantImages?: File[]): Observable<ApiResponse<Product>> {
    const formData = new FormData();
    
    // Agregar el JSON del producto
    formData.append('request', JSON.stringify(product));
    
    // Agregar las imágenes del producto
    productImages.forEach(image => {
      formData.append('productImages', image);
    });
    
    // Agregar las imágenes de las variantes si existen
    if (variantImages) {
      variantImages.forEach(image => {
        formData.append('variantImages', image);
      });
    }

    return this.http.post<ApiResponse<Product>>(this.apiUrl, formData);
  }

  updateProduct(id: number, product: Partial<Product>, productImages?: File[], variantImages?: File[]): Observable<ApiResponse<Product>> {
    const formData = new FormData();
    
    // Agregar el JSON del producto
    formData.append('request', JSON.stringify(product));
    
    // Agregar las imágenes del producto si existen
    if (productImages) {
      productImages.forEach(image => {
        formData.append('productImages', image);
      });
    }
    
    // Agregar las imágenes de las variantes si existen
    if (variantImages) {
      variantImages.forEach(image => {
        formData.append('variantImages', image);
      });
    }

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, formData);
  }

  toggleProductStatus(productId: number): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/${productId}/status`, {});
  }

  getProductStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`);
  }

  updateStock(productId: number, stock: number): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/${productId}/stock`, { stock })
      .pipe(
        map(response => {
          if (response.success) {
            response.data = this.addImageUrlsToProduct(response.data);
          }
          return response;
        })
      );
  }

  addProductImages(productId: number, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/${productId}/images`, formData)
      .pipe(
        map(response => {
          if (response.success) {
            response.data = this.addImageUrlsToProduct(response.data);
          }
          return response;
        })
      );
  }

  removeProductImage(productId: number, imageId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${productId}/images/${imageId}`);
  }

  private addImageUrlsToProduct(product: Product): Product {
    if (product.images) {
      product.images = product.images.map(image => ({
        ...image,
        url: `${this.imageBaseUrl}/${image.imagePath}`
      }));
    }

    if (product.variants) {
      product.variants = product.variants.map(variant => ({
        ...variant,
        images: variant.images.map(image => ({
          ...image,
          url: `${this.imageBaseUrl}/${image.imagePath}`
        }))
      }));
    }

    return product;
  }

  // Refactorizado para devolver Observable y depender del interceptor
  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchProducts(
    criteria: SearchCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Observable<ApiResponse<any>> {
    let [sortBy, direction] = sort.split(',');
    if (!direction) {
      direction = 'desc';
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    // Añadir criterios de búsqueda si existen
    if (criteria.query) {
      params = params.set('query', criteria.query);
    }
    if (criteria.active !== undefined) {
      params = params.set('active', criteria.active.toString());
    }
    if (criteria.minPrice !== undefined) {
      params = params.set('minPrice', criteria.minPrice.toString());
    }
    if (criteria.maxPrice !== undefined) {
      params = params.set('maxPrice', criteria.maxPrice.toString());
    }

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`, { params });
  }
}
