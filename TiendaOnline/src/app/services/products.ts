import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  image_url: string | null;
  sizes: (string | number)[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_id: string;
  categories: { name: string; slug: string };
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>('http://localhost:3000/api/products').pipe(
      map((res): Product[] => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res['data'])) return res['data'];
        return [];
      }),
    );
  }
}
