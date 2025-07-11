import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { HomeComponent } from './home/home.component';
import { LinesComponent } from './lines/lines.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LineDetailComponent,
    HomeComponent,
    LinesComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,          
    ReactiveFormsModule,  
    HttpClientModule,     
    AppRoutingModule,     
  ],
  providers: [
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
