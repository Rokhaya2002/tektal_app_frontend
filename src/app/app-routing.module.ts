import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { LinesComponent } from './lines/lines.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard'; 




const routes: Routes = [
  
  { path: '', redirectTo: 'register', pathMatch: 'full' },

 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'line/:id', component: LineDetailComponent, canActivate: [AuthGuard] },
  { path: 'lines', component: LinesComponent, canActivate: [AuthGuard] },
  
  


  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
