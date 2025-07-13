import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { LinesManagementComponent } from './lines-management/lines-management.component';
import { StopsManagementComponent } from './stops-management/stops-management.component';
import { SearchStatsComponent } from './search-stats/search-stats.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'lines-management',
    component: LinesManagementComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'stops-management',
    component: StopsManagementComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'search-stats',
    component: SearchStatsComponent,
    canActivate: [AdminAuthGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
