import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AtividadeAlunoService {
    private apiUrl = 'http://localhost:3000/api/atividade-aluno';
    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    buscarAlunosComNotas(atividadeId: number): Observable<any[]> {
        console.log('Buscando alunos para atividade ID:', atividadeId); 
        return this.http.get<any[]>(`${this.apiUrl}/${atividadeId}`, { headers: this.getHeaders() });
    }

    buscarNomeAtividade(atividadeId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/nome/${atividadeId}`, { headers: this.getHeaders() });
    }

    salvarNota(atividadeAlunoId: number | null, atividadeId: number, alunoId: number, nota: number): Observable<any> {
        const payload = { alunoId, atividadeId, nota };
        
        if (atividadeAlunoId) {
            return this.http.put(`${this.apiUrl}/${atividadeAlunoId}`, payload, { headers: this.getHeaders() });
        } else {
            return this.http.post(this.apiUrl, payload, { headers: this.getHeaders() });
        }
    }
}
