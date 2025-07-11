import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUser()?.subscribe({
        next: (user: any) => {
          this.userName = user.name;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération de l'utilisateur", err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.userName = null;
    this.router.navigate(['/login']);
  }
}
