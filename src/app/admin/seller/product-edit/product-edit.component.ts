import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { Product, ProductVariant, ProductRequest, ProductVariantRequest } from '../../../interfaces/product.interface';
import { UserService } from '../../../services/user.service';
import { PlanType } from '../../../models/user.model';

interface PlanLimits {
  variantsPerProduct: number;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: { variantsPerProduct: 2 },
  BASIC: { variantsPerProduct: 5 },
  PRO: { variantsPerProduct: Infinity }
};

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  userPlan: PlanType = 'FREE';
  PLAN_LIMITS = PLAN_LIMITS;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private userService: UserService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUserPlan();
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      variants: this.fb.array([])
    });
  }

  private async loadUserPlan(): Promise<void> {
    try {
      const user = await this.userService.getCurrentUser();
      this.userPlan = user.plan;
    } catch (error) {
      this.notificationService.error('Error al cargar el plan del usuario');
    }
  }

  private async loadProduct(id: string): Promise<void> {
    try {
      const product = await this.productService.getProduct(id);
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stock: product.stock
      });

      // Cargar variantes
      product.variants?.forEach(variant => {
        this.addVariant({
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          priceModifier: variant.priceModifier
        });
      });
    } catch (error) {
      this.notificationService.error('Error al cargar el producto');
      this.router.navigate(['/admin/seller/products']);
    }
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  canAddMoreVariants(): boolean {
    return this.variants.length < PLAN_LIMITS[this.userPlan].variantsPerProduct;
  }

  addVariant(variant?: ProductVariantRequest): void {
    if (!this.canAddMoreVariants()) {
      this.notificationService.warning(
        'Límite de variantes alcanzado',
        `Has alcanzado el límite de ${PLAN_LIMITS[this.userPlan].variantsPerProduct} variantes para tu plan ${this.userPlan}. ${
          this.userPlan === 'FREE' 
            ? 'Actualiza a BASIC para tener hasta 5 variantes o a PRO para variantes ilimitadas'
            : 'Actualiza a PRO para tener variantes ilimitadas'
        }`
      );
      return;
    }

    const variantForm = this.fb.group({
      size: [variant?.size || '', Validators.required],
      color: [variant?.color || '', Validators.required],
      stock: [variant?.stock || 0, [Validators.required, Validators.min(0)]],
      priceModifier: [variant?.priceModifier || 0, [Validators.required, Validators.min(0)]]
    });

    this.variants.push(variantForm);
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.notificationService.error('Por favor, completa todos los campos requeridos');
      return;
    }

    this.loading = true;
    try {
      const productData: ProductRequest = this.productForm.value;
      const productId = this.route.snapshot.params['id'];

      if (productId) {
        await this.productService.updateProduct(productId, productData);
        this.notificationService.success('Producto actualizado exitosamente');
      } else {
        await this.productService.createProduct(productData);
        this.notificationService.success('Producto creado exitosamente');
      }

      this.router.navigate(['/admin/seller/products']);
    } catch (error) {
      this.notificationService.error('Error al guardar el producto');
    } finally {
      this.loading = false;
    }
  }
} 