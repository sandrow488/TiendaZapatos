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
    
    return this.http.get<any>('http://localhost:3000/api/products?limit=100').pipe(
      map((res): Product[] => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res['data'])) return res['data'];
        return [];
      }),
    );
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>('http://localhost:3000/api/products', formData);
  }

  updateProduct(id: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`http://localhost:3000/api/products/${id}`, formData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/api/products/${id}`);
  }
}
