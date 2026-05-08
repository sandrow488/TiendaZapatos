import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductsService } from '../../services/products';

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalogo implements OnInit {
  private readonly productsService = inject(ProductsService);

  readonly products = signal<Product[]>([]);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('Todas');
  readonly isLoading = signal(true);

  readonly categoryOptions = ['Todas', 'Basketball', 'Lifestyle', 'Running', 'Training'];

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.brand?.toLowerCase().includes(term) ?? false);

      const matchesCategory =
        category === 'Todas' || product.categories.name === category;

      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
