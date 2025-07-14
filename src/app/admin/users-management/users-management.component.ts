import { Component, OnInit } from '@angular/core';
import {
  AdminUserService,
  User,
  UserStats,
  PaginatedUsers,
} from '../services/admin-user.service';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css'],
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  userStats: UserStats | null = null;
  loading = false;
  currentPage = 1;
  totalPages = 1;
  totalUsers = 0;
  perPage = 15;
  searchTerm = '';
  selectedRole = 'all';
  showCreateForm = false;
  showEditForm = false;
  selectedUser: User | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  // Formulaire de création/édition
  formData = {
    name: '',
    email: '',
    password: '',
    is_admin: false,
  };

  constructor(private userService: AdminUserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserStats();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers(
        this.currentPage,
        this.perPage,
        this.searchTerm,
        this.selectedRole
      )
      .subscribe({
        next: (response: PaginatedUsers) => {
          this.users = response.data;
          this.currentPage = response.pagination.current_page;
          this.totalPages = response.pagination.last_page;
          this.totalUsers = response.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          this.loading = false;
        },
      });
  }

  loadUserStats(): void {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onRoleChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  showCreateUserForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.resetForm();
  }

  showEditUserForm(user: User): void {
    this.selectedUser = user;
    this.showEditForm = true;
    this.showCreateForm = false;
    this.formData = {
      name: user.name,
      email: user.email,
      password: '',
      is_admin: user.is_admin,
    };
  }

  createUser(): void {
    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.password
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.clearMessages();
      return;
    }

    this.userService.createUser(this.formData).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Utilisateur créé avec succès !';
        this.showCreateForm = false;
        this.resetForm();
        this.loadUsers();
        this.loadUserStats();
        this.clearMessages();
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.errorMessage =
          error.error?.message || "Erreur lors de la création de l'utilisateur";
        this.clearMessages();
      },
    });
  }

  updateUser(): void {
    if (!this.selectedUser || !this.formData.name || !this.formData.email) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.clearMessages();
      return;
    }

    const updateData: any = {
      name: this.formData.name,
      email: this.formData.email,
      is_admin: this.formData.is_admin,
    };

    if (this.formData.password) {
      updateData.password = this.formData.password;
    }

    this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Utilisateur mis à jour avec succès !';
        this.showEditForm = false;
        this.resetForm();
        this.loadUsers();
        this.loadUserStats();
        this.clearMessages();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.errorMessage =
          error.error?.message ||
          "Erreur lors de la mise à jour de l'utilisateur";
        this.clearMessages();
      },
    });
  }

  deleteUser(user: User): void {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`
      )
    ) {
      this.userService.deleteUser(user.id).subscribe({
        next: (response) => {
          this.successMessage =
            response.message || 'Utilisateur supprimé avec succès !';
          this.loadUsers();
          this.loadUserStats();
          this.clearMessages();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage =
            error.error?.message ||
            "Erreur lors de la suppression de l'utilisateur";
          this.clearMessages();
        },
      });
    }
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || "Statut de l'utilisateur modifié avec succès !";
        this.loadUsers();
        this.loadUserStats();
        this.clearMessages();
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut:', error);
        this.errorMessage =
          error.error?.message || 'Erreur lors du changement de statut';
        this.clearMessages();
      },
    });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.resetForm();
    this.clearMessages();
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      password: '',
      is_admin: false,
    };
    this.selectedUser = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getStatusBadgeClass(user: User): string {
    if (user.is_admin) {
      return 'badge-admin';
    }
    return user.is_active !== false ? 'badge-active' : 'badge-inactive';
  }

  getStatusText(user: User): string {
    if (user.is_admin) return 'Admin';
    return user.is_active !== false ? 'Actif' : 'Inactif';
  }
}
