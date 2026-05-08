import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  image_url: string | null;
  sizes: unknown[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_id: string;
  categories: { name: string; slug: string };
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>('http://localhost:3000/api/products');
  }
}
