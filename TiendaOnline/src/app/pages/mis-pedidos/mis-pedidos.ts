import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrdersService, Order } from '../../services/orders';

@Component({
  selector: 'app-mis-pedidos',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisPedidos implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly http = inject(HttpClient);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.ordersService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudieron cargar los pedidos. Por favor, inicia sesión de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  cancelOrder(id: string): void {
    this.http.patch(`http://localhost:3000/api/orders/${id}/cancel`, {}).subscribe({
      next: () => {
        this.orders.update(orders =>
          orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o)
        );
      },
      error: (err) => {
        console.error('Error al cancelar el pedido', err);
        alert('No se pudo cancelar el pedido. Inténtalo de nuevo.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ';
    switch (status) {
      case 'pending': return base + 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return base + 'bg-blue-100 text-blue-800';
      case 'shipped': return base + 'bg-indigo-100 text-indigo-800';
      case 'delivered': return base + 'bg-green-100 text-green-800';
      case 'cancelled': return base + 'bg-red-100 text-red-800';
      default: return base + 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}
