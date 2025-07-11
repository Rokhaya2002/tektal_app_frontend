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

  suggestionsFrom: string[] = [];
  suggestionsTo: string[] = [];

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

  getSuggestions(query: string, field: 'from' | 'to') {
    if (!query.trim()) {
      if (field === 'from') this.suggestionsFrom = [];
      else this.suggestionsTo = [];
      return;
    }
    const url = `http://127.0.0.1:8000/api/stops/search?query=${query}`;
    this.http.get<string[]>(url).subscribe({
      next: (data) => {
        if (field === 'from') this.suggestionsFrom = data;
        else this.suggestionsTo = data;
      },
      error: () => {
        if (field === 'from') this.suggestionsFrom = [];
        else this.suggestionsTo = [];
      }
    });
  }
}
