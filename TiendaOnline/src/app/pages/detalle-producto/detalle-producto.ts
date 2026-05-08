import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductsService, Product } from '../../services/products';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-detalle-producto',
  imports: [CurrencyPipe],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleProducto implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  readonly product = signal<Product | null>(null);
  readonly selectedSize = signal<string | null>(null);
  readonly quantity = signal<number>(1);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getProducts()
        .pipe(map(response => response.data.find(p => p.id === id) || null))
        .subscribe(product => this.product.set(product));
    }
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  increaseQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct && this.quantity() < currentProduct.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    const size = this.selectedSize();
    if (p && size) {
      this.cartService.addToCart(p, size, this.quantity());
      this.router.navigate(['/carrito']);
    }
  }
}
