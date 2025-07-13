import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  // Ce composant sert de layout principal pour toutes les pages admin
  // Il inclut le header de navigation et le contenu via router-outlet
}
