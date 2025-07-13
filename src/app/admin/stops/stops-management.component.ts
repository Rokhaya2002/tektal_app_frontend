import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

interface Stop {
  id: number;
  name: string;
}

@Component({
  selector: 'app-stops-management',
  templateUrl: './stops-management.component.html',
  styleUrls: ['./stops-management.component.css'],
})
export class StopsManagementComponent implements OnInit {
  stops: Stop[] = [];
  stopForm: FormGroup;
  isEditing = false;
  editingStopId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Pagination
  page: number = 1;
  pageSize: number = 10;

  // Nouvelles propriétés pour la fonctionnalité de recherche
  showAddStopModal = false;
  searchTerm = '';
  filteredStops: Stop[] = [];
  selectedStop: Stop | null = null;
  isCreatingNew = false;

  // Exposer Math pour l'utiliser dans le template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private adminAuthService: AdminAuthService
  ) {
    this.stopForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStops();
  }

  private getHeaders(): HttpHeaders {
    return this.adminAuthService.getAuthHeaders();
  }

  get paginatedStops(): Stop[] {
    const start = (this.page - 1) * this.pageSize;
    return this.stops.slice(start, start + this.pageSize);
  }

  hasMoreStops(): boolean {
    return this.page * this.pageSize < this.stops.length;
  }

  nextPage() {
    if (this.hasMoreStops()) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  loadStops() {
    this.loading = true;
    this.http
      .get<Stop[]>('http://localhost:8000/api/admin/stops', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (stops) => {
          this.stops = stops;
          this.loading = false;
          this.page = 1;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des arrêts';
          this.loading = false;
        },
      });
  }

  // Nouvelles méthodes pour la fonctionnalité de recherche
  openAddStopModal() {
    this.showAddStopModal = true;
    this.searchTerm = '';
    this.filteredStops = [];
    this.selectedStop = null;
    this.isCreatingNew = false;
    this.resetForm();
  }

  closeAddStopModal() {
    this.showAddStopModal = false;
    this.searchTerm = '';
    this.filteredStops = [];
    this.selectedStop = null;
    this.isCreatingNew = false;
    this.resetForm();
  }

  searchStops() {
    if (this.searchTerm.trim() === '') {
      this.filteredStops = [];
      this.isCreatingNew = false;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredStops = this.stops.filter((stop) =>
      stop.name.toLowerCase().includes(term)
    );

    // Vérifier si l'arrêt existe déjà
    const exactMatch = this.stops.find(
      (stop) => stop.name.toLowerCase() === term
    );

    this.isCreatingNew = !exactMatch;
  }

  selectExistingStop(stop: Stop) {
    this.selectedStop = stop;
    this.isCreatingNew = false;
    this.searchTerm = stop.name;
    this.filteredStops = [];
  }

  createNewStop() {
    this.isCreatingNew = true;
    this.selectedStop = null;
    this.stopForm.patchValue({
      name: this.searchTerm,
    });
  }

  confirmAddStop() {
    if (this.selectedStop) {
      // L'arrêt existe déjà, on peut l'utiliser directement
      this.successMessage = `Arrêt "${this.selectedStop.name}" sélectionné`;
      this.closeAddStopModal();
      // Ici vous pouvez ajouter la logique pour utiliser cet arrêt
      // Par exemple, l'ajouter à une ligne ou l'utiliser dans un autre contexte
    } else if (this.isCreatingNew && this.stopForm.valid) {
      // Créer un nouvel arrêt
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.stopForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      const stopData = this.stopForm.value;
      const url =
        this.isEditing && this.editingStopId
          ? `http://localhost:8000/api/admin/stops/${this.editingStopId}`
          : 'http://localhost:8000/api/admin/stops';
      const method = this.isEditing ? 'put' : 'post';
      this.http[method](url, stopData, {
        headers: this.getHeaders(),
      }).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.successMessage = this.isEditing
            ? 'Arrêt modifié avec succès!'
            : 'Arrêt créé avec succès!';
          this.resetForm();
          this.loadStops();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || "Erreur lors de l'opération";
        },
      });
    }
  }

  editStop(stop: Stop) {
    this.isEditing = true;
    this.editingStopId = stop.id;
    this.stopForm.patchValue({ name: stop.name });
  }

  deleteStop(stopId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet arrêt ?')) {
      this.http
        .delete(`http://localhost:8000/api/admin/stops/${stopId}`, {
          headers: this.getHeaders(),
        })
        .subscribe({
          next: () => {
            this.successMessage = 'Arrêt supprimé avec succès!';
            this.loadStops();
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la suppression';
          },
        });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingStopId = null;
    this.stopForm.reset();
    this.selectedStop = null;
    this.isCreatingNew = false;
  }

  cancelEdit() {
    this.resetForm();
  }

  navigateToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  navigateToLines() {
    this.router.navigate(['/admin/lines']);
  }

  isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }
}
