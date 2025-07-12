import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { LinesComponent } from './lines/lines.component';
import { RetourComponent } from './retour/retour.component';

const routes: Routes = [
  { path: '', component: HomeComponent },             
  { path: 'search', component: SearchComponent },     
  { path: 'line/:id', component: LineDetailComponent },
  { path: 'lines', component: LinesComponent },
  { path: 'retour', component: RetourComponent }   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
