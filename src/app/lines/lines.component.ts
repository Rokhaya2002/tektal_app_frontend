import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Définition du composant Angular
@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],
})
export class LinesComponent implements OnInit {
  // Déclaration d'une variable pour stocker toutes les lignes récupérées depuis l'API
  lines: any[] = [];
  loading = true;
  error = false;

  // Type de ligne sélectionné pour filtrage (par défaut 'TATA')
  lineType: string = 'TATA';

  // Injection du service HttpClient via le constructeur pour permettre les requêtes HTTP
  constructor(private http: HttpClient) {}

  // Méthode appelée automatiquement lors de l'initialisation du composant
  ngOnInit(): void {
    this.loading = true;
    this.error = false;

    // Requête HTTP GET pour récupérer la liste de toutes les lignes depuis l'API backend
    this.http.get<any[]>('http://127.0.0.1:8000/api/all-lines').subscribe({
      next: (data) => {
        console.log('Lignes reçues:', data);
        this.lines = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des lignes:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  // Méthode appelée lorsqu'on veut changer le filtre de type de ligne
  setFilter(type: string) {
    console.log('Changement de filtre vers:', type);
    // Mise à jour de la variable lineType avec le type sélectionné (ex: 'TATA' ou 'DDD')
    this.lineType = type;
  }

  // Méthode qui retourne la liste des lignes filtrées en fonction du type sélectionné
  filteredLines(): any[] {
    const filtered = this.lines.filter((line) => {
      // Vérifie si le nom de la ligne contient 'tata' ou 'ddd' selon le type actif
      const matchType =
        (this.lineType === 'TATA' &&
          line.name.toLowerCase().includes('tata')) ||
        (this.lineType === 'DDD' && line.name.toLowerCase().includes('ddd'));
      return matchType;
    });

    console.log(`Lignes filtrées pour ${this.lineType}:`, filtered);
    return filtered;
  }
}
