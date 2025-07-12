import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { HomeComponent } from './home/home.component';
import { LinesComponent } from './lines/lines.component';
import { RetourComponent } from './retour/retour.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LineDetailComponent,
    HomeComponent,
    LinesComponent,
    RetourComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
     RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
