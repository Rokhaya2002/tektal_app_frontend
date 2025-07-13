import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active?: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_users: number;
  total_admins: number;
  total_regular_users: number;
  today_users: number;
  week_users: number;
  month_users: number;
  active_users: number;
  registration_trend: Array<{ date: string; count: number }>;
  most_active_users: Array<{
    id: number;
    name: string;
    email: string;
    search_count: number;
  }>;
}

export interface UserDetails {
  user: User;
  stats: {
    total_searches: number;
    unique_searches: number;
    last_search: string;
    account_age: string;
    last_login: string;
  };
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private readonly API_URL = 'http://localhost:8000/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService
  ) {}

  // Obtenir la liste des utilisateurs avec pagination
  getUsers(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    role?: string
  ): Observable<PaginatedUsers> {
    let params = `page=${page}&per_page=${perPage}`;
    if (search) params += `&search=${encodeURIComponent(search)}`;
    if (role) params += `&role=${role}`;

    return this.http.get<PaginatedUsers>(`${this.API_URL}/users?${params}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Obtenir les statistiques des utilisateurs
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.API_URL}/users/stats`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Obtenir l'activité récente
  getRecentActivity(): Observable<any> {
    return this.http.get(`${this.API_URL}/users/activity`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Obtenir les détails d'un utilisateur
  getUserDetails(id: number): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.API_URL}/users/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Créer un nouvel utilisateur
  createUser(userData: {
    name: string;
    email: string;
    password: string;
    is_admin?: boolean;
  }): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(
      `${this.API_URL}/users`,
      userData,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  // Mettre à jour un utilisateur
  updateUser(
    id: number,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      is_admin?: boolean;
    }
  ): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(
      `${this.API_URL}/users/${id}`,
      userData,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/users/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Activer/Désactiver un utilisateur
  toggleUserStatus(id: number): Observable<{ message: string; user: User }> {
    return this.http.patch<{ message: string; user: User }>(
      `${this.API_URL}/users/${id}/toggle-status`,
      {},
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }
}
