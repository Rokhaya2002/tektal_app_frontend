import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})
export class LineDetailComponent implements OnInit {
  line: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  // Fonction pour revenir à la page de recherche
  goBack(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Récupération des données de la ligne via l’API
    this.http.get(`http://127.0.0.1:8000/api/lines/${id}`).subscribe({
      next: (data) => {
        this.line = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails de la ligne', err);
      }
    });
  }
}

