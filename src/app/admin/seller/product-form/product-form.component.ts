import { Component, signal, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SubscriptionPlan } from '../../../interfaces/subscription.model';
import { ProductImage } from '../../../interfaces/product.interface';
import { ApiResponse } from '../../../interfaces/api-response.interface';
import { NotificationService } from '../../../services/notification.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component'; // Importar NotificationComponent

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent], // Añadir NotificationComponent a imports
  templateUrl: './product-form.component.html'
})
export default class ProductFormComponent implements OnInit {

  readonly PLAN_LIMITS: Record<SubscriptionPlan, { products: number; variants: number }> = {
    FREE: { products: 3, variants: 2 },
    BASIC: { products: 15, variants: 5 },
    PRO: { products: -1, variants: -1 }
  };

  productForm: FormGroup;
  productId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedProductImages: File[] = [];
  selectedVariantImages: File[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [''],
      basePrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      stock: [0],
      variants: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.productId.set(+id);
      this.loadProduct(id);
    }
  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant() {
    const plan = (this.authService.currentUserValue?.subscriptionPlan || 'FREE') as SubscriptionPlan;
    const variantLimit = this.PLAN_LIMITS[plan].variants;

    if (variantLimit !== -1 && this.variants.length >= variantLimit) {
      // Usar NotificationService para mostrar la advertencia
      this.notificationService.showWarning(`Tu plan ${plan} permite máximo ${variantLimit} variantes`, 5000); 
      return;
    }

    const variantForm = this.fb.group({
      size: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      color: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      sku: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9-_]+$')]],
      stock: [0, [Validators.required, Validators.min(0)]],
      priceModifier: [0, [Validators.required, Validators.min(0)]]
    });

    this.variants.push(variantForm);
  }

  removeVariant(index: number) {
    if (this.variants.length > 0) {
      this.variants.removeAt(index);
    }
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success) {
          const product = response.data;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            salePrice: product.salePrice,
            stock: product.stock,
            images: product.images
          });

          product.variants?.forEach(variant => {
            const variantForm = this.fb.group({
              size: [variant.size, Validators.required],
              color: [variant.color, Validators.required],
              sku: [variant.sku, Validators.required],
              stock: [variant.stock, [Validators.required, Validators.min(0)]],
              priceModifier: [variant.priceModifier, [Validators.required, Validators.min(0)]]
            });
            this.variants.push(variantForm);
          });
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Error al cargar el producto');
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.error.set('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }
    
    this.saveProduct();
  }

  private saveProduct() {
    this.loading.set(true);
    const productData = this.productForm.value;
  
    const request$ = this.productId()
      ? this.productService.updateProduct(this.productId()!, productData, this.selectedProductImages, this.selectedVariantImages)
      : this.productService.createProduct(productData, this.selectedProductImages, this.selectedVariantImages);
  
    request$.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/app/products']);
        } else {
          this.error.set(response.message);
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.error?.message || 'Error al guardar el producto');
        this.loading.set(false);
      }
    });
  }

  onProductImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      // Validar tipo y tamaño de imágenes
      const validFiles = Array.from(files).filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB máximo
        if (!isValidType) {
          this.error.set('Solo se permiten imágenes en formato JPG, PNG o WebP');
        }
        if (!isValidSize) {
          this.error.set('Las imágenes no deben superar los 5MB');
        }
        return isValidType && isValidSize;
      });

      this.selectedProductImages = validFiles;
    }
  }

  onVariantImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      // Validar tipo y tamaño de imágenes
      const validFiles = Array.from(files).filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB máximo
        if (!isValidType) {
          this.error.set('Solo se permiten imágenes en formato JPG, PNG o WebP');
        }
        if (!isValidSize) {
          this.error.set('Las imágenes no deben superar los 5MB');
        }
        return isValidType && isValidSize;
      });

      this.selectedVariantImages = validFiles;
    }
  }

  cancel() {
    this.router.navigate(['/app/products']);
  }

  showError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Para manejarlo la carga de imaganes de producto
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const productId = this.productId();
      if (productId === null || isNaN(productId)) {
        this.error.set('El ID del producto no es válido');
        return;
      }
  
      this.loading.set(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
  
      this.productService.addProductImages(productId, formData).subscribe({
        next: (response) => {
          if (response.success) {
            const currentImages = this.productForm.get('images')?.value || [];
            this.productForm.get('images')?.setValue([...currentImages, ...response.data.images]);
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.error?.message || 'Error al cargar las imágenes');
          this.loading.set(false);
        }
      });
    }
  }

  removeImage(imageId: number) {
    if (!this.productId()) return;
    
    this.loading.set(true);
    this.productService.removeProductImage(this.productId()!, imageId).subscribe({
      next: (response: ApiResponse<void>) => {
        if (response.success) {
          const currentImages = this.productForm.get('images')?.value || [];
          this.productForm.get('images')?.setValue(
            currentImages.filter((img: ProductImage) => img.id !== imageId)
          );
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        this.error.set(error.error?.message || 'Error al eliminar la imagen');
        this.loading.set(false);
      }
    });
  }

  getVariantError(index: number, field: string): string {
    const control = this.variants.at(index).get(field);
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['minlength']) return 'Texto demasiado corto';
      if (control.errors['maxlength']) return 'Texto demasiado largo';
      if (control.errors['pattern']) return 'Solo se permiten letras, números, guiones y guiones bajos';
      if (control.errors['min']) return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }

}
