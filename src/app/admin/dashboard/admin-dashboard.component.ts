import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminApiService, Line, Stop } from '../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  linesCount: number = 0;
  stopsCount: number = 0;
  today: string = '';
  welcomeMessage: string = '';
  recentLines: Line[] = [];
  recentStops: Stop[] = [];

  constructor(
    private router: Router,
    private authService: AdminAuthService,
    private apiService: AdminApiService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'admin est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.setToday();
    this.setWelcomeMessage();
    this.fetchCountsAndLatest();
  }

  setToday() {
    const now = new Date();
    this.today = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  setWelcomeMessage() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      this.welcomeMessage = 'Bonjour';
    } else if (hours < 18) {
      this.welcomeMessage = 'Bon après-midi';
    } else {
      this.welcomeMessage = 'Bonsoir';
    }
  }

  fetchCountsAndLatest() {
    // Récupérer les lignes
    this.apiService.getLines().subscribe({
      next: (lines) => {
        this.linesCount = lines.length;
        this.recentLines = [...lines]
          .sort((a, b) =>
            (b.created_at || '').localeCompare(a.created_at || '')
          )
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des lignes:', error);
        if (error.status === 401) {
          this.authService.handleAuthError();
        }
        this.linesCount = 0;
        this.recentLines = [];
      },
    });

    // Récupérer les arrêts
    this.apiService.getStops().subscribe({
      next: (stops) => {
        this.stopsCount = stops.length;
        this.recentStops = [...stops]
          .sort((a, b) =>
            (b.created_at || '').localeCompare(a.created_at || '')
          )
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des arrêts:', error);
        if (error.status === 401) {
          this.authService.handleAuthError();
        }
        this.stopsCount = 0;
        this.recentStops = [];
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateToLines() {
    this.router.navigate(['/admin/lines']);
  }

  navigateToStops() {
    this.router.navigate(['/admin/stops']);
  }
}
