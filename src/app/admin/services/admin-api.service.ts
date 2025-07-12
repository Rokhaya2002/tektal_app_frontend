import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export interface Line {
  id: number;
  name: string;
  departure: string;
  destination: string;
  created_at?: string;
  updated_at?: string;
}

export interface Stop {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchStats {
  total_searches: number;
  unique_searches: number;
  today_searches: number;
  week_searches: number;
  month_searches: number;
  most_popular: any[];
  recent_searches: any[];
  daily_stats: any[];
  hourly_stats: any[];
  top_destinations: any[];
  top_departures: any[];
}

export interface ChartData {
  date: string;
  searches: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService
  ) {}

  // Gestion des lignes
  getLines(): Observable<Line[]> {
    return this.http.get<Line[]>(`${this.API_URL}/admin/lines`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createLine(lineData: Partial<Line>): Observable<Line> {
    return this.http.post<Line>(`${this.API_URL}/admin/lines`, lineData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateLine(id: number, lineData: Partial<Line>): Observable<Line> {
    return this.http.put<Line>(`${this.API_URL}/admin/lines/${id}`, lineData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteLine(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/lines/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Gestion des arrêts
  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.API_URL}/admin/stops`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createStop(stopData: Partial<Stop>): Observable<Stop> {
    return this.http.post<Stop>(`${this.API_URL}/admin/stops`, stopData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateStop(id: number, stopData: Partial<Stop>): Observable<Stop> {
    return this.http.put<Stop>(`${this.API_URL}/admin/stops/${id}`, stopData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteStop(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/stops/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // Statistiques de recherche
  getSearchStats(): Observable<{ stats: SearchStats }> {
    return this.http.get<{ stats: SearchStats }>(
      `${this.API_URL}/admin/search-stats`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  getChartStats(
    period: string = 'week'
  ): Observable<{ chart_data: ChartData[] }> {
    return this.http.get<{ chart_data: ChartData[] }>(
      `${this.API_URL}/admin/search-chart-stats?period=${period}`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }
}
