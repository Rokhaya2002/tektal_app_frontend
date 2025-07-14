import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lines-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lines-management.component.html',
  styleUrls: ['./lines-management.component.css'],
})
export class LinesManagementComponent implements OnInit {
  lines: any[] = [];
  lineForm: FormGroup;
  editingLine: any = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: AdminApiService,
    private router: Router
  ) {
    this.lineForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_stop: ['', Validators.required],
      end_stop: ['', Validators.required],
      is_active: [true],
    });
  }

  ngOnInit(): void {
    this.loadLines();
  }

  loadLines(): void {
    this.loading = true;
    this.apiService.getLines().subscribe({
      next: (lines) => {
        this.lines = lines;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des lignes:', error);
        this.errorMessage = 'Erreur lors du chargement des lignes';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.lineForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const lineData = this.lineForm.value;

      if (this.editingLine) {
        // Mise à jour
        this.apiService.updateLine(this.editingLine.id, lineData).subscribe({
          next: () => {
            this.successMessage = 'Ligne mise à jour avec succès';
            this.resetForm();
            this.loadLines();
          },
          error: (error) => {
            this.errorMessage =
              error.error?.message || 'Erreur lors de la mise à jour';
            this.loading = false;
          },
        });
      } else {
        // Création
        this.apiService.createLine(lineData).subscribe({
          next: () => {
            this.successMessage = 'Ligne créée avec succès';
            this.resetForm();
            this.loadLines();
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

  onEditLine(line: any): void {
    this.editingLine = line;
    this.lineForm.patchValue({
      name: line.name,
      description: line.description,
      start_stop: line.start_stop,
      end_stop: line.end_stop,
      is_active: line.is_active,
    });
  }

  onDeleteLine(line: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
      this.loading = true;
      this.apiService.deleteLine(line.id).subscribe({
        next: () => {
          this.successMessage = 'Ligne supprimée avec succès';
          this.loadLines();
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
    this.lineForm.reset({
      is_active: true,
    });
    this.editingLine = null;
    this.loading = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
