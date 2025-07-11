import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    if (this.registerForm.invalid) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }
    
    if (this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        alert("Inscription réussie");
        this.router.navigate(['/login']);
      },
      error: err => {
        alert("Erreur d'inscription : " + (err.error?.message || 'Veuillez réessayer.'));
      }
    });
  }
}
