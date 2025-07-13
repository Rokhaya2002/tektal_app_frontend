import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminApiService, Line, Stop } from '../services/admin-api.service';
import { AdminUserService, UserStats } from '../services/admin-user.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  linesCount: number = 0;
  stopsCount: number = 0;
  userStats: UserStats | null = null;
  searchesCount: number = 0;
  today: string = '';
  welcomeMessage: string = '';
  recentLines: Line[] = [];
  recentStops: Stop[] = [];

  // Propriétés pour les animations
  animatedStats: {
    total_users: number;
    total_admins: number;
    total_regular_users: number;
    active_users: number;
    today_users: number;
    week_users: number;
    month_users: number;
  } = {
    total_users: 0,
    total_admins: 0,
    total_regular_users: 0,
    active_users: 0,
    today_users: 0,
    week_users: 0,
    month_users: 0,
  };

  private refreshSubscription: Subscription | null = null;
  private animationSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AdminAuthService,
    private apiService: AdminApiService,
    private userService: AdminUserService
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

    // Démarrer les mises à jour automatiques
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
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

  startAutoRefresh() {
    // Rafraîchir les données toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.fetchUserStats();
      this.fetchSearchStats();
    });
  }

  animateStats(targetStats: UserStats) {
    if (!targetStats) return;

    const duration = 1000; // 1 seconde
    const steps = 60;
    const stepDuration = duration / steps;

    this.animationSubscription = interval(stepDuration).subscribe((step) => {
      const progress = step / steps;

      this.animatedStats.total_users = Math.round(
        targetStats.total_users * progress
      );
      this.animatedStats.total_admins = Math.round(
        targetStats.total_admins * progress
      );
      this.animatedStats.total_regular_users = Math.round(
        targetStats.total_regular_users * progress
      );
      this.animatedStats.active_users = Math.round(
        targetStats.active_users * progress
      );
      this.animatedStats.today_users = Math.round(
        targetStats.today_users * progress
      );
      this.animatedStats.week_users = Math.round(
        targetStats.week_users * progress
      );
      this.animatedStats.month_users = Math.round(
        targetStats.month_users * progress
      );

      if (step >= steps) {
        this.animatedStats = { ...targetStats };
        if (this.animationSubscription) {
          this.animationSubscription.unsubscribe();
        }
      }
    });
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

    // Récupérer les statistiques des utilisateurs
    this.fetchUserStats();

    // Récupérer les statistiques de recherche
    this.fetchSearchStats();
  }

  fetchUserStats() {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
        this.animateStats(stats);
      },
      error: (error) => {
        console.error(
          'Erreur lors du chargement des statistiques utilisateurs:',
          error
        );
        this.userStats = null;
      },
    });
  }

  fetchSearchStats() {
    this.apiService.getSearchStats().subscribe({
      next: (response) => {
        this.searchesCount = response.stats.total_searches || 0;
      },
      error: (error) => {
        console.error(
          'Erreur lors du chargement des statistiques de recherche:',
          error
        );
        this.searchesCount = 0;
      },
    });
  }

  // Méthode pour forcer le rafraîchissement
  refreshData() {
    this.fetchCountsAndLatest();
  }

  // Méthode pour obtenir le statut de connexion en temps réel
  getConnectionStatus(): string {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 12) return 'matin';
    if (hour >= 12 && hour < 18) return 'après-midi';
    if (hour >= 18 && hour < 22) return 'soir';
    return 'nuit';
  }

  // Méthode pour formater les nombres avec des séparateurs
  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }

  // Méthode pour obtenir la tendance des utilisateurs
  getUserTrend(): string {
    if (!this.userStats) return 'stable';

    const today = this.userStats.today_users;
    if (today > 0) return 'croissance';
    if (today === 0) return 'stable';
    return 'déclin';
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

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }
}
