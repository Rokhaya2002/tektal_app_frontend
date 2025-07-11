import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  setToken(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken() {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!this.getToken();
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getUser() {
    const token = this.getToken();
    if (!token) return null;

    return this.http.get(`${this.baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
