import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(nome: string, email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrar-usuario`, { nome, email, senha });
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email });
}
}
