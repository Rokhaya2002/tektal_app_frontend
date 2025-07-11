import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Import du fichier CSS
})
export class LoginComponent {
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs correctement.";
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    });
  }
}
