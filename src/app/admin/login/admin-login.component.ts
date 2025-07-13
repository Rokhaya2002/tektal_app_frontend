import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AdminAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('AdminLoginComponent initialisé');
    // Vérifier si déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;
      console.log('Tentative de connexion:', credentials.email);

      this.authService
        .login(credentials.email, credentials.password)
        .subscribe({
          next: (response) => {
            console.log('Connexion réussie:', response);
            this.loading = false;
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            this.loading = false;
            this.errorMessage = error.error?.message || 'Erreur de connexion';
          },
        });
    }
  }

  // Méthode de test pour contourner l'authentification
  testLogin() {
    console.log('Test de connexion');
    this.router.navigate(['/admin/dashboard']);
  }
}
