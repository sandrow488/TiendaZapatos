import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdersService, AdminOrder } from '../../services/orders';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-admin-pedidos',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPedidos implements OnInit {
  private readonly ordersService = inject(OrdersService);

  readonly orders = signal<AdminOrder[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending',   label: 'Pendiente'  },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'shipped',   label: 'Enviado'    },
    { value: 'delivered', label: 'Entregado'  },
    { value: 'cancelled', label: 'Cancelado'  },
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.ordersService.getAllOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudieron cargar los pedidos.');
        this.isLoading.set(false);
      },
    });
  }

  changeStatus(orderId: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as OrderStatus;
    const snapshot = this.orders();

    
    this.orders.update(orders =>
      orders.map(o => o.id === orderId ? { ...o, status } : o)
    );

    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        
        this.orders.set(snapshot);
        alert(`Error al actualizar el estado: ${err.error?.error ?? 'Inténtalo de nuevo.'}`);
      },
    });
  }

  selectClass(status: string): string {
    const base = 'w-full rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ';
    switch (status) {
      case 'pending':   return base + 'border-yellow-300 bg-yellow-50  text-yellow-800 focus:ring-yellow-400';
      case 'confirmed': return base + 'border-blue-300   bg-blue-50    text-blue-800   focus:ring-blue-400';
      case 'shipped':   return base + 'border-indigo-300 bg-indigo-50  text-indigo-800 focus:ring-indigo-400';
      case 'delivered': return base + 'border-green-300  bg-green-50   text-green-800  focus:ring-green-400';
      case 'cancelled': return base + 'border-red-300    bg-red-50     text-red-800    focus:ring-red-400';
      default:          return base + 'border-gray-300   bg-gray-50    text-gray-800   focus:ring-gray-400';
    }
  }
}
