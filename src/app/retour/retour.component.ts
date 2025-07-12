import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-retour',
  templateUrl: './retour.component.html',
  styleUrls: ['./retour.component.css']
})
export class RetourComponent {
  form = {
    type: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  envoyerRetour() {
    this.http.post('http://localhost:8000/api/retour', this.form).subscribe({
      next: () => {
        alert('Merci pour votre retour !');
        this.form = { type: '', message: '' };
      },
      error: () => alert("Une erreur est survenue. Veuillez réessayer.")
    });
  }
}
