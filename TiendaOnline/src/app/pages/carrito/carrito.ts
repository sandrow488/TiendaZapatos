import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders';

@Component({
  selector: 'app-carrito',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrito {
  readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  readonly step = signal<'lista' | 'checkout'>('lista');
  
  
  readonly address = signal('');
  readonly notes = signal('');

  goToCheckout(): void {
    this.step.set('checkout');
  }

  placeOrder(): void {
    const orderData = {
      shipping_address: this.address(),
      notes: this.notes(),
      items: this.cartService.cartItems().map(item => ({
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: this.cartService.totalPrice()
    };

    this.ordersService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart();
        alert('¡Pedido realizado con éxito!');
        this.router.navigate(['/mis-pedidos']);
      },
      error: (err) => {
        console.error('Error al crear el pedido', err);
        alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
      }
    });
  }
}
