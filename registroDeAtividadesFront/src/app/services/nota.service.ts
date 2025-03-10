import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotaService {
    private apiUrl = 'http://localhost:3000/nota';

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    buscarNotasPorAvaliacao(avaliacaoId: number): Observable<any[]> {
        console.log("Chegou no service.")
        return this.http.get<any[]>(`${this.apiUrl}/${avaliacaoId}`, { headers: this.getHeaders() });
    }
}
