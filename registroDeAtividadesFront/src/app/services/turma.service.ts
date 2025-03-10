import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma } from '../models/turma.model';

@Injectable({
    providedIn: 'root'
})
export class TurmaService {

    private apiUrl = 'http://localhost:3000/api/turmas';

    constructor(private http: HttpClient) {}

    buscarTurmasPorAno(ano: number): Observable<Turma[]> {
        let headers = new HttpHeaders();
    
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            headers = headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.warn('⚠️ Executando no server, sem localStorage!');
        }
    
        return this.http.get<Turma[]>(`${this.apiUrl}-por-ano?ano=${ano}`, { headers });
    }
}
