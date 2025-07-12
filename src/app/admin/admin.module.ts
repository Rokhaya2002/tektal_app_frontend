import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminRegisterComponent } from './register/admin-register.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { LinesManagementComponent } from './lines/lines-management.component';
import { StopsManagementComponent } from './stops/stops-management.component';
import { SearchStatsComponent } from './search-stats/search-stats.component';

const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: AdminLoginComponent },
  { path: 'register', component: AdminRegisterComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'lines', component: LinesManagementComponent },
  { path: 'stops', component: StopsManagementComponent },
];

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminRegisterComponent,
    AdminDashboardComponent,
    LinesManagementComponent,
    StopsManagementComponent,
    SearchStatsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminRoutes),
  ],
})
export class AdminModule {}
