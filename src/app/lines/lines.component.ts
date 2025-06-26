import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css']
})
export class LinesComponent implements OnInit {
  lines: any[] = [];
  lineType: string = 'TATA'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/all-lines')
      .subscribe(data => {
        this.lines = data;
      });
  }

  setFilter(type: string) {
    this.lineType = type;
  }

  filteredLines(): any[] {
    return this.lines.filter(line => {
      const matchType =
        (this.lineType === 'TATA' && line.name.toLowerCase().includes('tata')) ||
        (this.lineType === 'DDD' && line.name.toLowerCase().includes('ddd'));
      return matchType;
    });
  }
}
