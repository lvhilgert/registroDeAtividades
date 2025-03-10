import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Checa se está no browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Pega o token
  getToken(): string {
    if (this.isBrowser()) {
      return localStorage.getItem('token') || '';
    }
    return '';  // Se não estiver no browser, retorna vazio
  }

  // Salva o token
  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  // Remove o token
  removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }
}
