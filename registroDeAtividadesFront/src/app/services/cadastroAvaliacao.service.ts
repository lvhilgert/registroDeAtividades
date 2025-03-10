import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroAvaliacaoService {

  private apiUrl = 'http://localhost:3000/api/avaliacoes'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  buscarAvaliacaoPorId(id: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  salvarAvaliacao(avaliacao: Avaliacao): Observable<any> {
    if (avaliacao.id && avaliacao.id > 0) {
      return this.http.put(`${this.apiUrl}/${avaliacao.id}`, avaliacao, { headers: this.getHeaders() });
    } else {
      return this.http.post(this.apiUrl, avaliacao, { headers: this.getHeaders() });
    }
  }

  excluirAvaliacao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
