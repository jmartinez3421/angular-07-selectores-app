import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    if(region !== ''){
      const url: string = `${this._baseUrl}/region/${region}?fields=name,cca2`;
      return this.http.get<PaisSmall[]>(url);
    }
    return of([]);
  }

  getPaisPorCodigo(code: string): Observable<Pais[]> {
    if (code !== '') {
      const url: string = `${this._baseUrl}/alpha/${code}`;
      return this.http.get<Pais[]>(url);
    }
    return of([]);
  }

  getPaisesFronterizos(codigos: string[]): Observable<PaisSmall[]> {
    if (codigos) {
      const codes = codigos.join(',').toLowerCase();
      const url: string = `${this._baseUrl}/alpha?codes=${codes}&fields=name,cca2`;
      return this.http.get<PaisSmall[]>(url);
    }

    return of([]);
  }
}
