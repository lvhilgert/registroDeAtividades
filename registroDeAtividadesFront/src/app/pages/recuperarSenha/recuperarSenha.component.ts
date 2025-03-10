import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-recuperar-senha',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recuperarSenha.component.html',
    styleUrls: ['./recuperarSenha.component.css']
})
export class RecuperarSenhaComponent {
  email = '';
  mensagem = '';
  mensagemErro = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}
  
  recuperar() {
    this.mensagem = '';
    this.mensagemErro = '';

    if (!this.email.trim()) {
        this.mensagemErro = 'Informe o e-mail.';
        return;
    }

    this.usuarioService.recuperarSenha(this.email).subscribe({
        next: () => {
            this.mensagem = 'Se este e-mail estiver cadastrado, você receberá as informações de acesso.';
        },
        error: () => {
            this.mensagemErro = 'Erro ao tentar recuperar a senha. Tente novamente.';
        }
      });
    }

  voltar() {
    this.router.navigate(['/login']);
  }
}
