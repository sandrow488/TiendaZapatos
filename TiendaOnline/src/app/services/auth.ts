import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

const API = 'http://localhost:3000/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<AuthUser | null>(this.loadUserFromStorage());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/login`, { email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  register(full_name: string, email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<{ message: string }>(`${API}/register`, { full_name, email, password })
      .pipe(switchMap(() => this.login(email, password)));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  private saveSession(res: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    this.currentUser.set(res.user);
  }

  private loadUserFromStorage(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
