import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  selector: 'app-stops-management',
  templateUrl: './stops-management.component.html',
  styleUrls: ['./stops-management.component.css'],
})
export class StopsManagementComponent implements OnInit {
  stops: any[] = [];
  stopForm: FormGroup;
  editingStop: any = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: AdminApiService,
    private router: Router
  ) {
    this.stopForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d+\.\d+$/)]],
      longitude: [
        '',
        [Validators.required, Validators.pattern(/^-?\d+\.\d+$/)],
      ],
      is_active: [true],
    });
  }

  ngOnInit(): void {
    this.loadStops();
  }

  loadStops(): void {
    this.loading = true;
    this.apiService.getStops().subscribe({
      next: (stops) => {
        this.stops = stops;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des arrêts:', error);
        this.errorMessage = 'Erreur lors du chargement des arrêts';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.stopForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const stopData = this.stopForm.value;

      if (this.editingStop) {
        // Mise à jour
        this.apiService.updateStop(this.editingStop.id, stopData).subscribe({
          next: () => {
            this.successMessage = 'Arrêt mis à jour avec succès';
            this.resetForm();
            this.loadStops();
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || 'Erreur lors de la mise à jour';
            this.loading = false;
          },
        });
      } else {
        // Création
        this.apiService.createStop(stopData).subscribe({
          next: () => {
            this.successMessage = 'Arrêt créé avec succès';
            this.resetForm();
            this.loadStops();
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || 'Erreur lors de la création';
            this.loading = false;
          },
        });
      }
    }
  }

  onEditStop(stop: any): void {
    this.editingStop = stop;
    this.stopForm.patchValue({
      name: stop.name,
      address: stop.address,
      latitude: stop.latitude,
      longitude: stop.longitude,
      is_active: stop.is_active,
    });
  }

  onDeleteStop(stop: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet arrêt ?')) {
      this.loading = true;
      this.apiService.deleteStop(stop.id).subscribe({
        next: () => {
          this.successMessage = 'Arrêt supprimé avec succès';
          this.loadStops();
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Erreur lors de la suppression';
          this.loading = false;
        },
      });
    }
  }

  resetForm(): void {
    this.stopForm.reset({
      is_active: true,
    });
    this.editingStop = null;
    this.loading = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  getErrorMessage(field: string): string {
    const control = this.stopForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('pattern')) {
      return 'Format invalide (ex: 48.8566)';
    }
    return '';
  }
}
