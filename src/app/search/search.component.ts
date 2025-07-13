import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  of,
} from 'rxjs';

interface SearchHistory {
  id?: number;
  from: string;
  to: string;
  count: number;
  last_searched_at?: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  from = '';
  to = '';
  results: any[] = [];
  noResult = false;

  // Propriétés pour l'autocomplétion
  fromSuggestions: string[] = [];
  toSuggestions: string[] = [];
  showFromSuggestions = false;
  showToSuggestions = false;

  // Propriétés pour l'historique
  searchHistory: SearchHistory[] = [];
  showHistory = false;
  historySuggestions: string[] = [];
  loadingHistory = false;

  // Observables pour le debounce
  private fromSearchSubject = new Subject<string>();
  private toSearchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifier l'authentification au chargement du composant
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadSearchHistory();

    // Configuration de l'autocomplétion pour le champ "from"
    this.fromSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.getAutocompleteSuggestions(query)),
        takeUntil(this.destroy$)
      )
      .subscribe((suggestions) => {
        this.fromSuggestions = suggestions || [];
        this.showFromSuggestions = (suggestions?.length || 0) > 0;
      });

    // Configuration de l'autocomplétion pour le champ "to"
    this.toSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.getAutocompleteSuggestions(query)),
        takeUntil(this.destroy$)
      )
      .subscribe((suggestions) => {
        console.log('Suggestions destination reçues :', suggestions);
        this.toSuggestions = suggestions || [];
        this.showToSuggestions = (suggestions?.length || 0) > 0;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Méthodes pour l'historique de recherche avec API backend
  private loadSearchHistory() {
    this.loadingHistory = true;
    const headers = this.authService.getAuthHeaders();

    this.http
      .get<{ data: SearchHistory[] }>(
        'http://127.0.0.1:8000/api/search-history?limit=20',
        { headers }
      )
      .subscribe({
        next: (response) => {
          console.log('Historique chargé:', response);
          this.searchHistory = response.data || [];
          this.loadingHistory = false;
        },
        error: (error) => {
          console.error("Erreur lors du chargement de l'historique:", error);
          this.searchHistory = [];
          this.loadingHistory = false;
        },
      });
  }

  private saveSearchHistoryToBackend(from: string, to: string) {
    const headers = this.authService.getAuthHeaders();

    this.http
      .post(
        'http://127.0.0.1:8000/api/search-history',
        {
          from: from,
          to: to,
        },
        { headers }
      )
      .subscribe({
        next: (response) => {
          console.log("Recherche sauvegardée dans l'historique");
        },
        error: (error) => {
          console.error("Erreur lors de la sauvegarde de l'historique:", error);
        },
      });
  }

  getHistorySuggestions(): string[] {
    const suggestions: string[] = [];

    // Ajouter les destinations les plus populaires
    const popularDestinations = this.searchHistory
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.to);

    suggestions.push(...popularDestinations);

    // Ajouter les départs les plus populaires
    const popularDepartures = this.searchHistory
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.from);

    suggestions.push(...popularDepartures);

    // Retourner les suggestions uniques
    return [...new Set(suggestions)];
  }

  selectFromHistory(item: SearchHistory) {
    this.from = item.from;
    this.to = item.to;
    this.showHistory = false;
    this.onSearch();
  }

  clearHistory() {
    const headers = this.authService.getAuthHeaders();

    this.http
      .delete('http://127.0.0.1:8000/api/search-history', { headers })
      .subscribe({
        next: () => {
          this.searchHistory = [];
          this.showHistory = false;
          console.log('Historique supprimé');
        },
        error: (error) => {
          console.error(
            "Erreur lors de la suppression de l'historique:",
            error
          );
        },
      });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.historySuggestions = this.getHistorySuggestions();
      // Recharger l'historique si nécessaire
      if (this.searchHistory.length === 0) {
        this.loadSearchHistory();
      }
    }
  }

  formatHistoryDate(dateString?: string): string {
    if (!dateString) return 'Récemment';

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "À l'instant";
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  // Méthode pour obtenir les suggestions d'autocomplétion
  private getAutocompleteSuggestions(query: string) {
    if (!query || query.length < 2) {
      return of([]);
    }
    return this.http.get<string[]>(
      `http://127.0.0.1:8000/api/autocomplete?q=${encodeURIComponent(query)}`
    );
  }

  // Méthodes pour gérer les changements de saisie
  onFromInput() {
    this.fromSearchSubject.next(this.from);
    this.showFromSuggestions = this.from.length >= 2;
    this.showHistory = false;
  }

  onToInput() {
    console.log('onToInput appelé, valeur :', this.to);
    this.toSearchSubject.next(this.to);
    this.showToSuggestions = this.to.length >= 2;
    this.showHistory = false;
  }

  // Méthodes pour sélectionner une suggestion
  selectFromSuggestion(suggestion: string) {
    this.from = suggestion;
    this.showFromSuggestions = false;
    this.fromSuggestions = [];
  }

  selectToSuggestion(suggestion: string) {
    this.to = suggestion;
    this.showToSuggestions = false;
    this.toSuggestions = [];
  }

  // Méthode pour fermer les suggestions
  closeSuggestions() {
    setTimeout(() => {
      this.showFromSuggestions = false;
      this.showToSuggestions = false;
      this.showHistory = false;
    }, 200);
  }

  // Méthode de recherche améliorée avec vérification d'authentification
  onSearch() {
    // Vérifier l'authentification avant de permettre la recherche
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.from || !this.to) {
      return;
    }

    const headers = this.authService.getAuthHeaders();
    const url = `http://127.0.0.1:8000/api/search?from=${encodeURIComponent(
      this.from
    )}&to=${encodeURIComponent(this.to)}`;

    this.http.get<any[]>(url, { headers }).subscribe(
      (data) => {
        this.results = data;
        this.noResult = data.length === 0;
        this.showFromSuggestions = false;
        this.showToSuggestions = false;
        this.showHistory = false;

        // Recharger l'historique après une recherche
        this.loadSearchHistory();
      },
      (error) => {
        console.error(error);
        this.results = [];
        this.noResult = true;
      }
    );
  }

  // Méthode pour obtenir des suggestions de lignes en temps réel
  getLineSuggestions() {
    if (!this.from || !this.to) {
      return;
    }

    const url = `http://127.0.0.1:8000/api/suggest-lines?from=${encodeURIComponent(
      this.from
    )}&to=${encodeURIComponent(this.to)}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        // Mettre à jour les résultats avec les suggestions en temps réel
        this.results = data;
        this.noResult = data.length === 0;
      },
      (error) => {
        console.error('Erreur lors de la récupération des suggestions:', error);
      }
    );
  }
}
