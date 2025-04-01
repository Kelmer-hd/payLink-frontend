import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { NotificationService } from '../../../services/notification.service';
import { ClipboardService } from '../../../services/clipboard.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 truncate">{{ product.name }}</h3>
          <span 
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            [class.bg-green-100]="product.active"
            [class.text-green-800]="product.active"
            [class.bg-gray-100]="!product.active"
            [class.text-gray-800]="!product.active"
          >
            {{ product.active ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        
        <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
        
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-2xl font-semibold tracking-tight text-gray-900">S/ {{ product.salePrice }}</span>
          @if (product.basePrice > product.salePrice) {
            <span class="text-sm text-gray-500 line-through">S/ {{ product.basePrice }}</span>
          }
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-gray-600">
            Stock: {{ product.stock }} unidades
          </span>
          <span class="text-sm text-gray-600">
            {{ product.variants.length }} variantes
          </span>
        </div>

        <!-- Link de compra -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Link de compra:</span>
              <span class="text-gray-600">{{ product.productLink.clicks }} clics</span>
            </div>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                [value]="purchaseLink"
                readonly
                class="flex-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-sm leading-6"
              >
              <button 
                (click)="copyPurchaseLink()"
                class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="mt-4 flex items-center justify-end gap-2">
          <button
            (click)="onEdit.emit(product)"
            class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Editar
          </button>
          <button
            (click)="onToggleStatus.emit(product.id)"
            class="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm"
            [class.bg-red-50]="product.active"
            [class.text-red-600]="product.active"
            [class.hover:bg-red-100]="product.active"
            [class.bg-green-50]="!product.active"
            [class.text-green-600]="!product.active"
            [class.hover:bg-green-100]="!product.active"
          >
            {{ product.active ? 'Desactivar' : 'Activar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() onEdit = new EventEmitter<Product>();
  @Output() onToggleStatus = new EventEmitter<number>();

  private notificationService = inject(NotificationService);
  private clipboardService = inject(ClipboardService);

  get purchaseLink(): string {
    return `${window.location.origin}/producto/${this.product.productLink.slug}`;
  }

  async copyPurchaseLink(): Promise<void> {
    try {
      await this.clipboardService.copyToClipboard(this.purchaseLink);
      this.notificationService.showSuccess('Link copiado al portapapeles');
    } catch (error) {
      this.notificationService.showError('No se pudo copiar el link al portapapeles');
    }
  }
}
