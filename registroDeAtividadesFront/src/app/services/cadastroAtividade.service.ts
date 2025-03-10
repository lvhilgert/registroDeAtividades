import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from '../models/atividade.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroAtividadeService {

  private apiUrl = 'http://localhost:3000/api/atividades';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  buscarAtividadePorId(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  salvarAtividade(atividade: Atividade): Observable<any> {
    if (atividade.id && atividade.id > 0) {
      return this.http.put(`${this.apiUrl}/${atividade.id}`, atividade, { headers: this.getHeaders() });
    } else {
      return this.http.post(this.apiUrl, atividade, { headers: this.getHeaders() });
    }
  }

  excluirAtividade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
