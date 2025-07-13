import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  adminName: string = '';
  currentDate: string = '';
  isMenuOpen: boolean = false;
  isAuthenticated: boolean = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadAdminInfo();
    this.updateDate();

    // Mise à jour de la date toutes les minutes
    setInterval(() => this.updateDate(), 60000);

    // Écouter les changements de route pour mettre à jour l'état d'authentification
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
        this.loadAdminInfo();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.adminAuthService.isAuthenticated();
    console.log("État d'authentification:", this.isAuthenticated);
  }

  loadAdminInfo(): void {
    if (this.isAuthenticated) {
      const admin = this.adminAuthService.getUser();
      console.log('Informations admin:', admin);
      if (admin) {
        this.adminName = admin.name || admin.email || 'Admin';
      } else {
        this.adminName = 'Admin';
      }
    } else {
      this.adminName = '';
    }
  }

  updateDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('isMenuOpen:', this.isMenuOpen);
  }

  navigateTo(route: string): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/admin', route]);
      this.isMenuOpen = false;
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  logout(): void {
    console.log('Déconnexion en cours...');
    this.adminAuthService.logout();
    this.isAuthenticated = false;
    this.adminName = '';
    this.isMenuOpen = false;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(`/admin/${route}`);
  }

  // Méthode pour forcer la mise à jour des informations
  refreshUserInfo(): void {
    this.checkAuthStatus();
    this.loadAdminInfo();
  }
}
