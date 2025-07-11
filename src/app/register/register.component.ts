import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']  // <--- important
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: [''],
    email: [''],
    password: [''],
    password_confirmation: ['']
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        alert("Inscription réussie");
        this.router.navigate(['/login']);
      },
      error: err => {
        alert("Erreur d'inscription");
      }
    });
  }
}
