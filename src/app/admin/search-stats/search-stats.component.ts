import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import {
  AdminApiService,
  SearchStats,
  ChartData,
} from '../services/admin-api.service';

@Component({
  selector: 'app-search-stats',
  templateUrl: './search-stats.component.html',
  styleUrls: ['./search-stats.component.css'],
})
export class SearchStatsComponent implements OnInit, OnDestroy, AfterViewInit {
  stats: SearchStats | null = null;
  chartData: ChartData[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  selectedPeriod = 'week';
  chart: any = null;

  constructor(
    private router: Router,
    private authService: AdminAuthService,
    private apiService: AdminApiService
  ) {}

  ngOnInit() {
    // Vérifier l'authentification
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadStats();
    this.loadChartData();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStats() {
    this.loading = true;
    this.error = false;

    // Vérifier à nouveau l'authentification
    if (!this.authService.isAuthenticated()) {
      this.authService.handleAuthError();
      return;
    }

    this.apiService.getSearchStats().subscribe({
      next: (response) => {
        this.stats = response.stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.error = true;
        if (error.status === 401) {
          this.errorMessage =
            'Session expirée. Redirection vers la page de connexion...';
          setTimeout(() => {
            this.authService.handleAuthError();
          }, 2000);
        } else if (error.status === 0) {
          this.errorMessage =
            'Impossible de se connecter au serveur. Vérifiez que le backend Laravel est démarré sur localhost:8000.';
        } else {
          this.errorMessage = `Erreur ${error.status}: ${
            error.error?.message || 'Erreur lors du chargement des statistiques'
          }`;
        }
        this.loading = false;
      },
    });
  }

  loadChartData() {
    // Vérifier à nouveau l'authentification
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.apiService.getChartStats(this.selectedPeriod).subscribe({
      next: (response) => {
        this.chartData = response.chart_data;
        this.renderChart();
      },
      error: (error) => {
        console.error(
          'Erreur lors du chargement des données graphiques:',
          error
        );
        if (error.status === 401) {
          this.authService.handleAuthError();
        }
        this.chartData = [];
        this.renderChart();
      },
    });
  }

  onPeriodChange() {
    this.loadChartData();
  }

  getChartHeight(): number {
    if (!this.chartData.length) return 200;
    const maxSearches = Math.max(...this.chartData.map((d) => d.searches));
    return Math.max(200, Math.min(400, maxSearches * 2));
  }

  getBarHeight(searches: number): number {
    if (!this.chartData.length) return 0;
    const maxSearches = Math.max(...this.chartData.map((d) => d.searches));
    return maxSearches > 0 ? (searches / maxSearches) * 100 : 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    if (this.selectedPeriod === 'day') {
      // Format pour les heures (HH:mm)
      const hour = parseInt(dateString);
      return `${hour.toString().padStart(2, '0')}:00`;
    }

    // Format pour les dates (dd/mm)
    if (dateString.includes('-')) {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;
    }

    return dateString;
  }

  async renderChart() {
    if (typeof window === 'undefined') return;

    try {
      // Import dynamique d'ApexCharts
      const ApexCharts = await import('apexcharts');
      const ApexChartsModule = ApexCharts.default;

      // Détruire le graphique existant
      if (this.chart) {
        this.chart.destroy();
      }

      const chartElement = document.getElementById('apexChart');
      if (!chartElement || this.chartData.length === 0) {
        return;
      }

      const options = {
        chart: {
          type: 'area',
          height: 200,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        series: [
          {
            name: 'Recherches',
            data: this.chartData.map((d) => d.searches),
          },
        ],
        xaxis: {
          categories: this.chartData.map((d) => this.formatDate(d.date)),
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px',
              fontFamily: 'Inter, Arial, sans-serif',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px',
              fontFamily: 'Inter, Arial, sans-serif',
            },
          },
        },
        colors: ['#8b5cf6'],
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#8b5cf6'],
        },
        markers: {
          size: 5,
          colors: ['#8b5cf6'],
          strokeColors: '#fff',
          strokeWidth: 2,
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ['#8b5cf6'],
            fontWeight: 700,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: '#8b5cf6',
                opacity: 0.7,
              },
              {
                offset: 100,
                color: '#8b5cf6',
                opacity: 0.1,
              },
            ],
          },
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 4,
        },
        tooltip: {
          theme: 'light',
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, Arial, sans-serif',
          },
        },
      };

      this.chart = new ApexChartsModule(chartElement, options);
      this.chart.render();
    } catch (error) {
      console.error('Erreur lors du rendu du graphique:', error);
    }
  }

  retry() {
    this.loadStats();
    this.loadChartData();
  }
}
