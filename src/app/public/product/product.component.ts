import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-public-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (loading) {
          <div class="flex justify-center items-center min-h-[400px]">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        } @else if (error) {
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
        } @else if (product) {
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ product.description }}</p>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Precio</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    S/ {{ product.salePrice }}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Stock disponible</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ product.stock }} unidades
                  </dd>
                </div>
              </dl>
            </div>
            <div class="px-4 py-5 sm:px-6">
              <button
                (click)="comprarProducto()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
              >
                Comprar ahora
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PublicProductComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    } else {
      this.error = 'Producto no encontrado';
      this.loading = false;
    }
  }

  loadProduct(slug: string) {
    this.productService.getProductBySlug(slug).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = response.data;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Error al cargar el producto';
        this.loading = false;
      }
    });
  }

  comprarProducto() {
    // Aquí implementaremos la lógica de compra
    console.log('Implementar lógica de compra');
  }
} 