import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno.model';

@Injectable({
    providedIn: 'root'
})
export class AlunoService {
    private apiUrl = 'http://localhost:3000/api/alunos-ano-turma';

    constructor(private http: HttpClient) {}

    buscarAlunos(anoVigente: number, turmaId?: number): Observable<Aluno[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        let url = `${this.apiUrl}?anoVigente=${anoVigente}`;
        if (turmaId && turmaId > 0) {
            url += `&turmaId=${turmaId}`;
        }

        return this.http.get<Aluno[]>(url, { headers });
    }
}
