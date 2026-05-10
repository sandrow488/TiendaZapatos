import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  size: string | null;
  created_at: string;
  products: {
    name: string;
    image_url: string;
    brand: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface AdminOrder extends Order {
  user_email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/api/orders';

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.API, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API}/my-orders`);
  }

  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(this.API);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.API}/${orderId}/status`, { status });
  }
}
