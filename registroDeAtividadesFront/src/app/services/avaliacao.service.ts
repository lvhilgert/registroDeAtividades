import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';

@Injectable({
    providedIn: 'root'
})
export class AvaliacaoService {
    private apiUrl = 'http://localhost:3000/api/avaliacoes-ano-turma';
    private apiUrlComAtividades = 'http://localhost:3000/api/avaliacoes-com-atividades';

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    buscarAvaliacoes(anoVigente: number, turmaId?: number): Observable<Avaliacao[]> {
        let url = `${this.apiUrl}?anoVigente=${anoVigente}`;
        if (turmaId && turmaId > 0) {
            url += `&turmaId=${turmaId}`;
        }
        return this.http.get<Avaliacao[]>(url, { headers: this.getHeaders() });
    }

    buscarAvaliacoesComAtividades(anoVigente: number, turmaId?: number): Observable<Avaliacao[]> {
        let url = `${this.apiUrlComAtividades}?anoVigente=${anoVigente}`;
        if (turmaId && turmaId > 0) {
            url += `&turmaId=${turmaId}`;
        }
        return this.http.get<Avaliacao[]>(url, { headers: this.getHeaders() });
    }
}
