import { Component, OnInit, signal, inject } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../interfaces/subscription.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { computed } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

interface PlanLimits {
  products: number;
  variantsPerProduct: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ProductCardComponent,
    NotificationComponent
  ],
  templateUrl: './products.component.html'
})
export default class ProductsComponent implements OnInit {
  private readonly PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
    FREE: { products: 3, variantsPerProduct: 2 },
    BASIC: { products: 15, variantsPerProduct: 5 },
    PRO: { products: -1, variantsPerProduct: -1 } // Unlimited
  };

  // Services
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // Signals
  products = signal<Product[]>([]);
  loading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = signal(10);
  isLastPage = signal(false);
  isFirstPage = signal(true);
  activeProductCount = signal(0);
  userPlan = signal<SubscriptionPlan>('FREE');
  searchTerm = signal('');
  productStats = signal<any>(null);
  
  // Computed values
  productLimit = computed(() => {
    const planLimit = this.PLAN_LIMITS[this.userPlan()].products;
    return planLimit === -1 ? 999999 : planLimit;
  });

  variantLimit = computed(() => {
    const planLimit = this.PLAN_LIMITS[this.userPlan()].variantsPerProduct;
    return planLimit === -1 ? 999999 : planLimit;
  });

  // Expose Math for template
  protected readonly Math = Math;

  constructor() {
    const plan = this.authService.currentUserValue?.subscriptionPlan;
    this.userPlan.set(plan as SubscriptionPlan || 'FREE');
  }

  ngOnInit() {
    this.loadProducts();
    this.loadProductStats();
  }

  loadProducts(page: number = 0) {
    this.loading.set(true);
    const currentSearchTerm = this.searchTerm(); // Obtener el término de búsqueda actual
    const criteria = { query: currentSearchTerm }; // Crear objeto de criterios
    const sortString = 'createdAt,desc'; // Definir ordenación (puedes hacerlo dinámico si lo necesitas)

    // Llamar al nuevo método searchProducts
    this.productService.searchProducts(criteria, page, this.pageSize(), sortString)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.products.set(response.data.content);
            this.totalPages.set(response.data.totalPages);
            this.totalElements.set(response.data.totalElements);
            this.currentPage.set(page);
            this.isLastPage.set(page >= response.data.totalPages - 1);
            this.isFirstPage.set(page === 0);
          } else {
            this.notificationService.showError(response.message || 'Error al cargar los productos');
          }
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.notificationService.showError('Error al cargar los productos');
        }
      });
  }

  loadProductStats() {
    this.productService.getProductStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.productStats.set(response.data);
          this.activeProductCount.set(response.data.activeProducts);
        }
      },
      error: (error) => {
        console.error('Error loading product stats:', error);
        this.notificationService.showError('Error al cargar las estadísticas de productos');
      }
    });
  }

  canCreateMoreProducts(): boolean {
    return this.activeProductCount() < this.productLimit();
  }

  canAddMoreVariants(currentVariants: number): boolean {
    return currentVariants < this.variantLimit();
  }

  getVariantLimitMessage(): string {
    const limit = this.variantLimit();
    if (limit === 999999) return 'variantes ilimitadas';
    return `hasta ${limit} variantes por producto`;
  }

  crearProducto() {
    if (!this.canCreateMoreProducts()) {
      const currentPlan = this.userPlan();
      const currentLimit = this.PLAN_LIMITS[currentPlan].products;
      const activeCount = this.activeProductCount();
      const variantLimit = this.PLAN_LIMITS[currentPlan].variantsPerProduct;
      
      let message = `Has alcanzado el límite de ${activeCount}/${currentLimit} productos de tu plan ${currentPlan}. `;
      message += `\nLímites del plan ${currentPlan}:`;
      message += `\n- ${currentLimit} productos`;
      message += `\n- ${variantLimit === -1 ? 'Ilimitadas' : variantLimit} variantes por producto`;
      
      if (currentPlan === 'FREE') {
        message += '\n\nActualiza a BASIC para obtener:';
        message += '\n- 15 productos';
        message += '\n- 5 variantes por producto';
        message += '\n\nO a PRO para productos y variantes ilimitados.';
      } else if (currentPlan === 'BASIC') {
        message += '\n\nActualiza a PRO para obtener productos y variantes ilimitados.';
      }

      this.notificationService.showWarning(message, 8000);
      return;
    }
    this.router.navigate(['/app/products/create']);
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/app/products/edit', product.id]);
  }

  onToggleStatus(productId: number) {
    this.productService.toggleProductStatus(productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadProducts(this.currentPage());
          this.loadProductStats();
          this.notificationService.showSuccess('Estado del producto actualizado');
        } else {
          this.notificationService.showError(response.message || 'Error al actualizar el estado del producto');
        }
      },
      error: (error) => {
        console.error('Error toggling product status:', error);
        this.notificationService.showError('Error al actualizar el estado del producto');
      }
    });
  }

  nextPage() {
    if (!this.isLastPage()) {
      this.loadProducts(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (!this.isFirstPage()) {
      this.loadProducts(this.currentPage() - 1);
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.loadProducts(0);
  }

  irAPlanes() {
    this.router.navigate(['/app/planes']);
  }
}
