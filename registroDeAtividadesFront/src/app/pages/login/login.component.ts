import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  fazerLogin() {
    this.usuarioService.login(this.email, this.senha).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);  // Salva token
        localStorage.setItem('usuarioId', res.usuarioId);  // Salva ID do usuário logado
        this.router.navigate(['/inicio']);  // Manda para a tela inicial
      },
      error: () => {
        this.mensagemErro = 'Login inválido!';
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-usuario']);
}

irParaRecuperarSenha() {
  this.router.navigate(['/recuperar-senha']);
}

}
