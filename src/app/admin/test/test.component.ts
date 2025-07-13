import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div
      style="padding: 20px; text-align: center; background: #f0f0f0; border-radius: 10px; margin: 20px;"
    >
      <h1 style="color: #093FB4;">✅ Test Admin Route</h1>
      <p>Si vous voyez ce message, les routes admin fonctionnent !</p>
      <p><strong>URL actuelle:</strong> {{ currentUrl }}</p>
      <p><strong>Timestamp:</strong> {{ timestamp }}</p>
      <div style="margin-top: 20px;">
        <button
          (click)="goToLogin()"
          style="background: #093FB4; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer;"
        >
          Aller à Login
        </button>
        <button
          (click)="goToDashboard()"
          style="background: #ED3500; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer;"
        >
          Aller au Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class TestComponent implements OnInit {
  currentUrl = '';
  timestamp = '';

  ngOnInit() {
    // Utilisation sécurisée pour SSR
    if (typeof window !== 'undefined') {
      this.currentUrl = window.location.href;
    } else {
      this.currentUrl = 'Serveur-side rendering';
    }
    this.timestamp = new Date().toLocaleString('fr-FR');
  }

  goToLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }

  goToDashboard() {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/dashboard';
    }
  }
}
