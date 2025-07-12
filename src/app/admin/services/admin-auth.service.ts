import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface LoginResponse {
  user: AdminUser;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly API_URL = 'http://localhost:8000/api';
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/admin/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
        }),
        catchError((error) => {
          console.error('Erreur de connexion:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const user = localStorage.getItem(this.USER_KEY);
      return !!(token && user);
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUser(): AdminUser | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    }
    return headers;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUser(user: AdminUser): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  handleAuthError(): void {
    this.clearAuth();
    this.router.navigate(['/admin/login']);
  }
}
