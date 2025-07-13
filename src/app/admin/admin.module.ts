import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { LinesManagementComponent } from './lines/lines-management.component';
import { StopsManagementComponent } from './stops/stops-management.component';
import { SearchStatsComponent } from './search-stats/search-stats.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { AdminHeaderComponent } from './header/admin-header.component';

const adminRoutes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'lines', component: LinesManagementComponent },
      { path: 'stops', component: StopsManagementComponent },
      { path: 'users', component: UsersManagementComponent },
    ]
  }
];

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminLayoutComponent,
    AdminDashboardComponent,
    LinesManagementComponent,
    StopsManagementComponent,
    SearchStatsComponent,
    UsersManagementComponent,
    AdminHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminRoutes),
  ],
})
export class AdminModule {}
