import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService, Product } from '../../services/products';
import { CategoriesService, Category } from '../../services/categories';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductos implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  productForm: FormGroup;
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentProductId = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  
  availableSizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];
  selectedSizes = signal<string[]>([]);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      brand: [''],
      category_id: ['', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products.set(data);
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  openModal(product?: Product): void {
    if (product) {
      this.isEditing.set(true);
      this.currentProductId.set(product.id);
      this.productForm.patchValue({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        brand: product.brand || '',
        category_id: product.category_id,
        is_active: product.is_active
      });
      this.selectedSizes.set(product.sizes ? product.sizes.map(s => String(s)) : []);
    } else {
      this.isEditing.set(false);
      this.currentProductId.set(null);
      this.productForm.reset({ price: 0, stock: 0, is_active: true });
      this.selectedSizes.set([]);
    }
    this.selectedFile.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  toggleSize(size: string): void {
    const sizes = this.selectedSizes();
    if (sizes.includes(size)) {
      this.selectedSizes.set(sizes.filter(s => s !== size));
    } else {
      this.selectedSizes.set([...sizes, size]);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    const formValues = this.productForm.value;

    formData.append('name', formValues.name || '');
    formData.append('description', formValues.description || '');
    formData.append('price', formValues.price != null ? formValues.price : 0);
    formData.append('stock', formValues.stock != null ? formValues.stock : 0);
    formData.append('brand', formValues.brand || '');
    
    
    if (formValues.category_id && formValues.category_id !== 'null' && formValues.category_id !== 'undefined') {
      formData.append('category_id', formValues.category_id);
    }
    
    formData.append('is_active', formValues.is_active);
    formData.append('sizes', JSON.stringify(this.selectedSizes()));

    const file = this.selectedFile();
    if (file) {
      formData.append('image', file);
    }

    if (this.isEditing()) {
      const id = this.currentProductId();
      if (id) {
        this.productsService.updateProduct(id, formData).subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating product:', err);
            alert('Error al actualizar el producto: ' + (err.error?.error || err.message));
          }
        });
      }
    } else {
      this.productsService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          alert('Error al crear el producto: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productsService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
