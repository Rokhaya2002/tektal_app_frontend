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
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.userService.createUser(this.formData).subscribe({
      next: (response) => {
        alert(response.message);
        this.showCreateForm = false;
        this.resetForm();
        this.loadUsers();
        this.loadUserStats();
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        alert("Erreur lors de la création de l'utilisateur");
      },
    });
  }

  updateUser(): void {
    if (!this.selectedUser || !this.formData.name || !this.formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
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
        alert(response.message);
        this.showEditForm = false;
        this.resetForm();
        this.loadUsers();
        this.loadUserStats();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        alert("Erreur lors de la mise à jour de l'utilisateur");
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
          alert(response.message);
          this.loadUsers();
          this.loadUserStats();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert("Erreur lors de la suppression de l'utilisateur");
        },
      });
    }
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadUsers();
        this.loadUserStats();
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut:', error);
        alert('Erreur lors du changement de statut');
      },
    });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.resetForm();
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
