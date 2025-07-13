import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

interface Line {
  id: number;
  name: string;
  departure: string;
  destination: string;
  stops: Stop[];
}

interface Stop {
  id: number;
  name: string;
}

@Component({
  selector: 'app-lines-management',
  templateUrl: './lines-management.component.html',
  styleUrls: ['./lines-management.component.css'],
})
export class LinesManagementComponent implements OnInit {
  lines: Line[] = [];
  stops: Stop[] = [];
  lineForm: FormGroup;
  isEditing = false;
  editingLineId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Nouvelles propriétés pour la sélection d'arrêts mobile-friendly
  selectedStops: Stop[] = [];
  showStopsSelection = false;

  // Propriétés pour la pagination
  page = 1;
  pageSize = 10;
  totalLines = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private adminAuthService: AdminAuthService // Ajouté
  ) {
    this.lineForm = this.fb.group({
      name: ['', Validators.required],
      departure: ['', Validators.required],
      destination: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLines();
    this.loadStops();
  }

  // Méthodes de pagination
  get paginatedLines(): Line[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.lines.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.lines.length / this.pageSize);
  }

  hasMoreLines(): boolean {
    return this.page * this.pageSize < this.lines.length;
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.hasMoreLines()) {
      this.page++;
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
    }
  }

  private getHeaders(): HttpHeaders {
    return this.adminAuthService.getAuthHeaders();
  }

  loadLines() {
    this.loading = true;
    this.http
      .get<Line[]>('http://localhost:8000/api/admin/lines', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (lines) => {
          this.lines = lines;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des lignes';
          this.loading = false;
        },
      });
  }

  loadStops() {
    this.http
      .get<Stop[]>('http://localhost:8000/api/admin/stops', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (stops) => {
          this.stops = stops;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des arrêts';
        },
      });
  }

  // Nouvelles méthodes pour la sélection d'arrêts
  toggleStopsSelection() {
    this.showStopsSelection = !this.showStopsSelection;
  }

  isStopSelected(stop: Stop): boolean {
    return this.selectedStops.some(
      (selectedStop) => selectedStop.id === stop.id
    );
  }

  toggleStopSelection(stop: Stop) {
    if (this.isStopSelected(stop)) {
      this.selectedStops = this.selectedStops.filter((s) => s.id !== stop.id);
    } else {
      this.selectedStops.push(stop);
    }
  }

  getSelectedStopsText(): string {
    if (this.selectedStops.length === 0) {
      return 'Aucun arrêt sélectionné';
    }
    if (this.selectedStops.length === 1) {
      return this.selectedStops[0].name;
    }
    return `${this.selectedStops.length} arrêts sélectionnés`;
  }

  clearSelectedStops() {
    this.selectedStops = [];
  }

  onSubmit() {
    if (this.lineForm.valid && this.selectedStops.length > 0) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const lineData = {
        ...this.lineForm.value,
        selectedStops: this.selectedStops.map((stop) => stop.id),
      };

      const url = this.isEditing
        ? `http://localhost:8000/api/admin/lines/${this.editingLineId}`
        : 'http://localhost:8000/api/admin/lines';

      const method = this.isEditing ? 'put' : 'post';

      this.http[method](url, lineData, {
        headers: this.getHeaders(),
      }).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = this.isEditing
            ? 'Ligne modifiée avec succès!'
            : 'Ligne créée avec succès!';
          this.resetForm();
          this.loadLines();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || "Erreur lors de l'opération";
        },
      });
    } else if (this.selectedStops.length === 0) {
      this.errorMessage = 'Veuillez sélectionner au moins un arrêt';
    }
  }

  editLine(line: Line) {
    this.isEditing = true;
    this.editingLineId = line.id;
    this.lineForm.patchValue({
      name: line.name,
      departure: line.departure,
      destination: line.destination,
    });
    this.selectedStops = line.stops || [];
  }

  deleteLine(lineId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
      this.http
        .delete(`http://localhost:8000/api/admin/lines/${lineId}`, {
          headers: this.getHeaders(),
        })
        .subscribe({
          next: () => {
            this.successMessage = 'Ligne supprimée avec succès!';
            this.loadLines();
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la suppression';
          },
        });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingLineId = null;
    this.lineForm.reset();
    this.selectedStops = [];
    this.showStopsSelection = false;
  }

  cancelEdit() {
    this.resetForm();
  }

  navigateToStops() {
    this.router.navigate(['/admin/stops']);
  }

  navigateToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  // Méthode pour détecter si l'utilisateur est sur mobile
  isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }
}
