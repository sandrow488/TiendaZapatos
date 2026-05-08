import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './products';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  
  readonly cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  readonly totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product, size: string, quantity: number): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id && i.size === size);
      if (existing) {
        return items.map(i => 
          i.product.id === product.id && i.size === size 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      return [...items, { product, size, quantity }];
    });
    this.saveCartToStorage();
  }

  removeItem(index: number): void {
    this.cartItems.update(items => items.filter((_, i) => i !== index));
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }
  }

  private loadCartFromStorage(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
