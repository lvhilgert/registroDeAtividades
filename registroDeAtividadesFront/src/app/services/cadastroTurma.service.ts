import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma } from '../models/turma.model';

@Injectable({
    providedIn: 'root'
})
export class CadastroTurmaService {

    private apiUrl = 'http://localhost:3000/api/turmas';

    constructor(private http: HttpClient) {}

    buscarTurmaPorId(id: number): Observable<Turma> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Turma>(`${this.apiUrl}/${id}`, { headers });
    }

    salvarTurma(turma: Turma): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        if (turma.id && turma.id > 0) {
            // Atualizar turma (PUT)
            return this.http.put(`${this.apiUrl}/${turma.id}`, turma, { headers });
        } else {
            // Criar nova turma (POST)
            return this.http.post(this.apiUrl, turma, { headers });
        }
    }

    excluirTurma(id: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
    
}
