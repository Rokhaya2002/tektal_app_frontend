import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  from = '';
  to = '';
  results: any[] = [];
  noResult = false;

  constructor(private http: HttpClient) {}

  onSearch() {
    const url = `http://127.0.0.1:8000/api/search?from=${this.from}&to=${this.to}`;
    this.http.get<any[]>(url).subscribe(
      data => {
        this.results = data;
        this.noResult = data.length === 0;
      },
      error => {
        console.error(error);
        this.results = [];
        this.noResult = true;
      }
    );
  }
}
