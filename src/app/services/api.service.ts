import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3001/api'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private createAuthHeaders(token: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.authService.getIdToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers: headers });
      })
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.authService.getIdToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
      })
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.authService.getIdToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.authService.getIdToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers });
      })
    );
  }
}
