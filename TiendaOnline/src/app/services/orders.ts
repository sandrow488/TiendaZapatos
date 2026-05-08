import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/api/orders';

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.API, orderData);
  }
}
