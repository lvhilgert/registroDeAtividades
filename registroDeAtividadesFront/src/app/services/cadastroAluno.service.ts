import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroAlunoService {

  private apiUrl = 'http://localhost:3000/api/alunos'; // Ajuste conforme necessário

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  buscarAlunoPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  verificarAlunoExistente(nome: string, turmaId: number): Observable<{ existe: boolean }> {
    const params = new URLSearchParams({ nome, turmaId: turmaId.toString() });
    return this.http.get<{ existe: boolean }>(`${this.apiUrl}-verificar?${params}`, { headers: this.getHeaders() });
  }


  salvarAluno(aluno: Aluno): Observable<any> {
    if (aluno.id && aluno.id > 0) {
      return this.http.put(`${this.apiUrl}/${aluno.id}`, aluno, { headers: this.getHeaders() });
    } else {
      return this.http.post(this.apiUrl, aluno, { headers: this.getHeaders() });
    }
  }

  salvarVariosAlunos(alunos: { nome: string, turmaId: number, ativo: boolean }[]): Observable<any> {
    return this.http.post(`${this.apiUrl}-lote`, { alunos }, { headers: this.getHeaders() });
  }


  excluirAluno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
